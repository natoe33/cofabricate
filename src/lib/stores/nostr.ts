import { writable } from 'svelte/store';
//import NDKSvelte from '@nostr-dev-kit/ndk-svelte';
import NDK from '@nostr-dev-kit/ndk';
import { browser } from '$app/environment';

let relays;

try {
	if (browser) relays = localStorage.getItem('relays');
} catch (e) {
	console.error(e);
}

let relayList: string[] = [];

if (relays) {
	relayList = JSON.parse(relays);
}

export const defaultRelays = ['wss://purplepag.es', 'wss://relay.damus.io', 'wss://relay.f7z.io'];

if (!relayList || !Array.isArray(relayList) || relayList.length === 0) {
	relayList = defaultRelays;
}

const _ndk: NDK = new NDK({
	devWriteRelayUrls: ['wss://relay.strfront.com'],
	explicitRelayUrls: relayList,
	enableOutboxModel: true,
	autoConnectUserRelays: true,
	autoFetchUserMutelist: true,
	clientName: 'cofabricate'
}) as NDK;

_ndk.connect();

console.debug('Nostr store current user: ', _ndk.activeUser?.profile);

const ndkStore = writable(_ndk);

export const ndk = ndkStore;

const _bunkerNDK = new NDK({
	explicitRelayUrls: [...defaultRelays, 'wss://relay.nsecbunker.com', 'wss://nostr.vulpem.com']
});

export const bunkerNDK = writable(_bunkerNDK);
