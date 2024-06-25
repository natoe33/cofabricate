import { writable } from "svelte/store";

export type LoginState = 'logging-in' | 'logged-in' | 'contacting-remote-signer' | 'logged-out';
export const loginState = writable<LoginState | null>(null);