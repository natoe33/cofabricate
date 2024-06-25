<script lang="ts">
	import UserInterface from '$lib/interfaces/user';
	import { ndk } from '$lib/stores/nostr';
	import { currentUser } from '$lib/store';
	import type { NDKUserProfile, NDKUser } from '@nostr-dev-kit/ndk';
	import { get } from 'svelte/store';

	let image: string | undefined;
	const _ndk = get(ndk);

	let random = (Math.random() + 1).toString(36).substring(6);

	let defaultImage = `https://robohash.org/${random}`;

	if (!_ndk.activeUser?.profile?.image) {
		image = defaultImage;
	} else {
		image = _ndk.activeUser.profile.image;
	}

	$: {image = _ndk.activeUser?.profile?.image;}
	// $: {
	// 	//image = $currentUser?.profile?.image;
	// 	image = _ndk.activeUser?.profile?.image;
	// 	console.debug(image);
	// }
</script>

<figure class="image">
	{#if !_ndk.activeUser}
		<img src={defaultImage} alt="Generic Avatar" class="is-rounded" />
	{:else}
		<img src={image} alt="User Avatar" class="is-rounded" />
	{/if}
</figure>
