import { loginState } from "$lib/stores/sesson";
import { loggedIn, login, type LoginMethod } from "$lib/utils/login";
import { ndk } from "$lib/stores/nostr";
import { get } from "svelte/store";
import { currentUser } from "$lib/store";
import { NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";

const _ndk = get(ndk);

export async function browserSetup() {
    const pubkey = localStorage.getItem('pubkey');
    console.debug(pubkey);

    if (pubkey){
        const u = _ndk.getUser({pubkey});
		u.fetchProfile();
        loginState.set('logging-in')
        currentUser.set(u);
    }

    const method = localStorage.getItem('nostr-key-method') as LoginMethod;

    if (!pubkey && method !== 'none') return newSessionTryNip07();

    if (method && pubkey) {
        return await login(method, pubkey);
    }
}

export async function newSessionTryNip07() {
	let signer: NDKNip07Signer | undefined;
	let u: NDKUser | null | undefined;

	try {
		console.debug('trying nip07 signer');
		signer = new NDKNip07Signer();
		u = await signer.blockUntilReady();
		u.fetchProfile();
	} catch (e) {
		console.debug('nip07Signer failed', e);
	}

	if (u && signer) {
		console.debug('nip07Signer succeeded');
		await loggedIn(signer, u, 'nip07');
	}
}