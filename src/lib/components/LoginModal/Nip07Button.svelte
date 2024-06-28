<script lang="ts">
	import { ndk } from '$lib/stores/nostr';
	import { login } from '$lib/utils/login';
	import { currentUser } from '$lib/store';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';

	let noNip07: boolean;
	let _ndk = get(ndk);

	$: if (browser) {
		noNip07 = !window.nostr;
	}

	const dispatch = createEventDispatcher();

	async function nip07Login() {
		const user = await login('nip07', undefined);
		if (!user) alert('Nip07 Login Failed');
		else {
			$currentUser = user;
			await $currentUser.fetchProfile();
			localStorage.setItem('nostr-key-method', 'nip07');
			localStorage.setItem('nostr-target-npub', $currentUser.npub);
			_ndk.activeUser = $currentUser;
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
