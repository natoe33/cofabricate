import { writable } from "svelte/store";
import NDK from "@nostr-dev-kit/ndk";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { RelayList } from "@nostr-dev-kit/ndk-svelte-components";

let relays;

try {
    relays = localStorage.getItem('relays');
} catch (e) {}

let relayList: string[] = [];

if (relays) {
    relayList = JSON.parse(relays);
}

export const defaultRelays = [
    'wss://purplepag.es',
    'wss://relay.damus.io'
]

if (!relayList || !Array.isArray(relayList) || relayList.length === 0) {
    relayList = defaultRelays;
}

const _ndk: NDKSvelte = new NDKSvelte({
    devWriteRelayUrls: ['wss://relay.strfront.com'],
    explicitRelayUrls: relayList,
    enableOutboxModel: true,
}) as NDKSvelte;

const ndk = writable(_ndk);

export default ndk;