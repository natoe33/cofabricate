import { writable } from 'svelte/store';
// import { ndk } from "$lib/stores/nostr";
// import type { NDKUser } from "@nostr-dev-kit/ndk";

// let $ndk = get(ndk);

// export let user: NDKUser | undefined = undefined;

export type LoginState = 'logging-in' | 'logged-in' | 'contacting-remote-signer' | 'logged-out';
export const loginState = writable<LoginState | null>(null);

// if ($ndk.cacheAdapter?.fetchProfile)
