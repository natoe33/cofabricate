<!-- ndk-svelte-components/LoginDropdown.svelte -->
<script lang="ts">
	import { ndk } from '$lib/stores/nostr';
	import Nip07Button from './LoginModal/Nip07Button.svelte';
</script>

{#if !$ndk.signer}
	<div></div>
{/if}
