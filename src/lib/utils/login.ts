import type NDK from '@nostr-dev-kit/ndk';
import {
	NDKNip07Signer,
	NDKNip46Signer,
	NDKPrivateKeySigner,
	NDKUser,
	type Hexpubkey,
	type NDKSigner
} from '@nostr-dev-kit/ndk';
import { bunkerNDK, ndk } from '$lib/stores/nostr';
import { currentUser } from '$lib/store';
import { loginState } from '$lib/stores/sesson';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export type LoginMethod = 'none' | 'pk' | 'nip07' | 'nip46';

let $ndk: NDK;
const $bunkerNDK: NDK = get(bunkerNDK);


export async function login(method: LoginMethod, userPubkey?: string): Promise<NDKUser | null> {
	console.debug(`logging in with ${method}`);
	let u: NDKUser | null | undefined;
	$ndk = get(ndk);

	switch (method) {
		case 'none':
			loginState.set(null);
			return null;
		case 'pk':
			return await pkLogin();
		case 'nip07':
			u = await nip07Login($ndk);
			console.debug('Logged in as: ', u);
			loginState.set('logged-in');
			return u;
		case 'nip46':
			return await nip46Login(userPubkey);
		default: {
			const promise = new Promise<NDKUser | null>((resolve) => {
				let loadAttempts = 0;
				const loadNip07Interval = setInterval(async () => {
					if (window.nostr) {
						clearInterval(loadNip07Interval);
						const user = await nip07Login($ndk);
						resolve(user);
					}
					if (loadAttempts++ > 10) clearInterval(loadNip07Interval);
				}, 100);
			});
			return promise;
		}
	}
}

async function pkLogin(): Promise<NDKUser | null> {
	const key = localStorage.getItem('nostr-key');
	if (!key) return null;
	else return await pkSignin(key);
}

async function pkSignin(key: string): Promise<NDKUser | null> {
	const signer = new NDKPrivateKeySigner(key);
	const user = await signer.user();
	if (user) loggedIn(signer, user!, 'pk');
	await user.fetchProfile();
	currentUser.set(user);
	sessionStorage.setItem('user', JSON.stringify(user));
	return user;
}

async function nip07Login(ndk: NDK): Promise<NDKUser | null> {
	const storedNpub = browser ? localStorage.getItem('pubkey') : '';
	let user: NDKUser | null = null;

	if (storedNpub) {
		user = new NDKUser({ npub: storedNpub });
		user.ndk = ndk;
		console.debug('Nip07 - logging in with stored npub', storedNpub);
	}

	if (window.nostr) {
		try {
			ndk.signer = new NDKNip07Signer();
			user = await ndk.signer?.blockUntilReady();
			user.ndk = ndk;
			user.fetchProfile();
			ndk.activeUser = user;
			user.ndk = ndk;
			console.debug('Nip07 Login user:', user);
			console.debug('NDK: ', ndk);
			if (user) localStorage.setItem('nostr-key-method', 'nip07');
			localStorage.setItem('pubkey', user.pubkey);
			await user.fetchProfile();
			currentUser.set(user);
			sessionStorage.setItem('user', JSON.stringify(user));
			$ndk = ndk;
		} catch (e) {
			console.error(`NIP-07 login error: ${e}`);
		}
	}
	if (user) await user.fetchProfile();
	return user;
}

async function nip46Login(remotePubkey?: Hexpubkey): Promise<NDKUser | null> {
	const existingPrivateKey = localStorage.getItem('nostr-nsecbunker-key')!;
	let remoteUser: NDKUser | undefined;

	console.debug({ existingPrivateKey, remotePubkey });

	if (!existingPrivateKey) return null;

	if (remotePubkey) remoteUser = $ndk.getUser({ pubkey: remotePubkey });

	if (!remoteUser) return null;

	currentUser.set(remoteUser);

	console.debug('NIP46 setting user: ', remoteUser);

	$bunkerNDK.pool.on('relay:ready', async () => {
		console.debug('bunker relay ready');
		loginState.set('contacting-remote-signer');
		await nip46SignIn(existingPrivateKey, remoteUser!);
	});

	console.debug('connecting to nsecbunker relay');
	$bunkerNDK.connect(2500);
	return remoteUser;
}

async function nip46SignIn(existingPrivateKey: string, remoteUser: NDKUser) {
	remoteUser.ndk = $bunkerNDK;
	let localSigner: NDKPrivateKeySigner | null = null;

	if (existingPrivateKey) localSigner = new NDKPrivateKeySigner(existingPrivateKey);
	else {
		alert('Local signer not available');
		return null;
	}

	const remoteSigner = new NDKNip46Signer($bunkerNDK, remoteUser.pubkey, localSigner!);

	console.debug('contacting remote signer');
	remoteSigner.blockUntilReady();
	console.debug('Remote signer connected');

	localStorage.setItem('nostr-nsecbunker-key', localSigner.privateKey!);

	loggedIn(remoteSigner, remoteUser, 'nip46');
}

export async function loggedIn(signer: NDKSigner, u: NDKUser, method: LoginMethod) {
	const _ndk = get(ndk);
	_ndk.signer = signer;
	u.ndk = _ndk;
	await u.fetchProfile();
	currentUser.set(u);
	_ndk.activeUser = u;
	console.log('DEBUG setting user (loggedIn)', u);
	loginState.set('logged-in');

	localStorage.setItem('pubkey', u.pubkey);
	localStorage.setItem('nostr-key-method', method);
}
