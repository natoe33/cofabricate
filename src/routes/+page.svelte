<script lang='ts'>
    import { ndk } from "$lib/stores/nostr.js";
	import { NDKHighlight } from '@nostr-dev-kit/ndk';
    import { RelayList } from "@nostr-dev-kit/ndk-svelte-components";

    // export let data;
    const highlights = ndk.storeSubscribe(
        {kinds: [9802 as number]},
        {closeOnEose: true},
        NDKHighlight
    );
</script>
<svelte:head>
    <title>Decentralized Manufacturing</title>
</svelte:head>

<h1>Home</h1>

<p>
    {$highlights.length}
    {ndk.explicitRelayUrls}
    {ndk.activeUser}
</p>