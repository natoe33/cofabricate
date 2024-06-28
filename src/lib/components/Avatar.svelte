<script lang="ts">
	import { ndk } from '$lib/stores/nostr';
	import { currentUser } from '$lib/store';
	import NDK, { NDKUser } from '@nostr-dev-kit/ndk';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	let image: string | undefined;
	let _ndk = get(ndk);
	let sessionProfile: NDKUser | null = null;

	onMount(() => {
		const sessionProfileObj = sessionStorage.getItem('user');
		sessionProfile = sessionProfileObj ? JSON.parse(sessionProfileObj) : null;
		if (sessionProfile) {
			image = sessionProfile.profile?.image;
		}
	});

	const _currentUser = get(currentUser);

	let random = (Math.random() + 1).toString(36).substring(6);
	let defaultImage = `https://robohash.org/${random}`;

	image = defaultImage;

	$: {
		console.debug(sessionProfile);
		image = sessionProfile?.profile?.image;
	}

	$: ndkUpdated(_ndk);

	function ndkUpdated(_ndk: NDK) {
		console.debug('NDK updated');
		if (_ndk.activeUser && _ndk.activeUser.profile && _ndk.activeUser.profile.image) {
			image = _ndk.activeUser.profile.image;
		} else {
			image = defaultImage;
		}
		_ndk = _ndk;
	}
</script>

<figure class="image">
	{#if !_ndk.activeUser}
		<img src={defaultImage} alt="Generic Avatar" class="is-rounded" />
	{:else}
		<img src={image} alt="User Avatar" class="is-rounded" />
	{/if}
</figure>
