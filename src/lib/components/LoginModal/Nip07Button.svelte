<script lang="ts">
	import { ndk } from '$lib/stores/nostr';
	import { login } from '$lib/utils/login';
	import { currentUser } from '$lib/store';

	let noNip07: boolean;

	$: noNip07 = !window.nostr;

	async function nip07Login() {
		const user = await login($ndk, undefined, 'nip07');
		if (!user) alert('Nip07 Login Failed');
		else {
			$currentUser = user;
			localStorage.setItem('nostr-key-method', 'nip07');
			localStorage.setItem('nostr-target-npub', $currentUser.npub);
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
	<button on:click={nip07Login}>
		<span>Use Browser Extension</span>
	</button>
{/if}
