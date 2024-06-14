<script lang="ts">
	import UserInterface from '$lib/interfaces/user';
	import { ndk } from '$lib/stores/nostr';
	import type { NDKUserProfile } from '@nostr-dev-kit/ndk';
	export let userProfile: NDKUserProfile | undefined;

	let _userProfile = userProfile;
	let image: string | undefined;
	let defaultImage = `https://robohash.org/${userProfile?.id?.slice(0, 2)}`;

	let observerUserProfile;

	if (!_userProfile?.image) {
		observerUserProfile = $ndk.activeUser?.profile;
	}

	$: {
		_userProfile = $observerUserProfile! as NDKUserProfile;
		image = _userProfile.image;
	}
</script>

<img src={image || defaultImage} alt="User Avatar" class="is-rounded" />
