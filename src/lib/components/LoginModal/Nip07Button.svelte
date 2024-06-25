<script lang="ts">
	import { ndk } from '$lib/stores/nostr';
	import { login } from '$lib/utils/login';
	import { currentUser } from '$lib/store';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	let noNip07: boolean;

	$: if (browser) {
		noNip07 = !window.nostr;
	}

	const dispatch = createEventDispatcher();

	async function nip07Login() {
		const user = await login($ndk, undefined, 'nip07');
		if (!user) alert('Nip07 Login Failed');
		else {
			$currentUser = user;
			$currentUser.fetchProfile();
			localStorage.setItem('nostr-key-method', 'nip07');
			localStorage.setItem('nostr-target-npub', $currentUser.npub);
			dispatch('closeModal');
			console.debug($currentUser);
		}
	}
</script>

{#if noNip07}
	<div class="alert">
		<span>No Nostr extension in your browser</span>
		<div class="hidden">
			<button class="button is-small">Need Help?</button>
		</div>
	</div>
{:else}
	<button on:click={nip07Login}>Use Browser Extension</button>
{/if}
