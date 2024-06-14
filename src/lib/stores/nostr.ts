import { writable } from 'svelte/store';
import NDKSvelte from '@nostr-dev-kit/ndk-svelte';

let relays;

try {
	relays = localStorage.getItem('relays');
} catch (e) {}

let relayList: string[] = [];

if (relays) {
	relayList = JSON.parse(relays);
}

export const defaultRelays = ['wss://purplepag.es', 'wss://relay.damus.io', 'wss://relay.f7z.io'];

if (!relayList || !Array.isArray(relayList) || relayList.length === 0) {
	relayList = defaultRelays;
}

const _ndk: NDKSvelte = new NDKSvelte({
	devWriteRelayUrls: ['wss://relay.strfront.com'],
	explicitRelayUrls: relayList,
	enableOutboxModel: true,
	autoConnectUserRelays: true,
	autoFetchUserMutelist: true
}) as NDKSvelte;

_ndk.connect();

console.log(_ndk.activeUser?.profile);

const ndkStore = writable(_ndk);

export const ndk = ndkStore;
