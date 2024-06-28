<script lang="ts">
	import { currentUser } from '$lib/store';
	import { ndk } from '$lib/stores/nostr';
	import { NDKList } from '@nostr-dev-kit/ndk';
	import { get, writable } from 'svelte/store';

	const $ndk = get(ndk);

	export const userBlossom = writable<NDKList | null>(null);
</script>
