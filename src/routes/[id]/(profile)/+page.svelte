<script lang="ts">
    import { page } from "$app/stores";
    import { ndk } from "$lib/stores/nostr";
    import type NDK from "@nostr-dev-kit/ndk";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let id: string;
    let { user } = $page.data;
    let _ndk: NDK;

    onMount(() => {
        _ndk = get(ndk);
    })

    $: if (id !== $page.params.id){
        id = $page.params.id;
        user.ndk = _ndk;
    }


</script>