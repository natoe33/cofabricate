<script lang='ts'>
    import { ndk } from '$lib/stores/nostr';
</script>

{#if !$ndk.signer}
    <div></div>
{/if}