<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import { ndk } from '$lib/stores/nostr';
	import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
	import { onMount } from 'svelte';

	onMount(async () => {
		await signIn();
	});

	async function signIn() {
		console.debug('signIn called');
		let signer;
		try {
			signer = await new NDKNip07Signer();
		} catch (e) {}
		console.log(signer);

		//if (!signer) return;

		$ndk.signer = signer;

		const pubkey = await signer?.user();
		console.log(pubkey);

		if (pubkey) {
			$ndk.activeUser = pubkey;
			await $ndk.activeUser.fetchProfile();
			console.log($ndk.activeUser);
		}

		await $ndk.connect();
	}
</script>

<NavBar on:signin={signIn} />
<slot></slot>
