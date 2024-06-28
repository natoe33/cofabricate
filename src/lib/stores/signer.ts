import { findEphemeralSigner } from '$lib/signers/ephemeral';
import NDK, { NDKPrivateKeySigner, type NDKSigner, type NDKUser } from '@nostr-dev-kit/ndk';
import { writable, get as getStore, derived } from 'svelte/store';
import { ndk } from './nostr';
import { currentUser as currentUserStore } from '../store';
import type NDKList from '$lib/ndk-kinds/lists';

export type SignerStoreItem = {
	signer: NDKPrivateKeySigner;
	user: NDKUser;
	saved: boolean;
	name?: string;
	id: string;
};

type SignerItems = Map<string, SignerStoreItem>;

export const signers = writable<SignerItems>(new Map());
export const npubSigners = derived(signers, ($signers) => {
	const npubs = new Map<string, NDKSigner>();

	for (const entry of $signers) {
		const { user, signer } = entry[1];

		npubs.set(user.npub, signer);
	}

	return npubs;
});

async function getDelegatedSignerName(list: NDKList) {
	let name = '';
	const currentUser = getStore(currentUserStore);

	if (currentUser && !currentUser.profile) {
		currentUser.ndk = getStore(ndk);
		await currentUser?.fetchProfile();
	}

	if (currentUser?.profile?.name) {
		name = currentUser.profile.displayName + `'s `;
	}

	return name + list.name;
}

export async function getSigner(list: NDKList): Promise<SignerStoreItem> {
	const store = getStore(signers);
	const id = list.encode();
	let item = store.get(id);

	if (item) return item;

	const _ndk: NDK = getStore(ndk);
	let signer = await findEphemeralSigner(_ndk, _ndk.signer!, {
		associatedEventNip19: list.encode()
	});

	if (signer) {
		console.log(`found a signer for list ${list.name}`);
		item = {
			signer: signer!,
			user: await signer.user(),
			saved: true,
			id
		};
	} else {
		signer = NDKPrivateKeySigner.generate();
		item = {
			signer,
			user: await signer.user(),
			saved: false,
			name: await getDelegatedSignerName(list),
			id
		};
	}
	item.user.ndk = _ndk;

	store.set(id, item);

	return item;
}
