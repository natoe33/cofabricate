<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { ndk } from '$lib/stores/nostr';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let active = false;

	let avatarimage: string | undefined;
	$: {
		avatarimage = $ndk.activeUser?.profile?.image;
	}

	function signIn() {
		console.debug('signing in');
		dispatch('signin');
	}
</script>

<nav class="navbar" aria-label="main navigation">
	<div class="navbar-brand">
		<h1 class="title is-1">CoFabricate</h1>
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			role="button"
			class="navbar-burger"
			class:is-active={active}
			aria-label="menu"
			aria-expanded="false"
			data-target="mainMenu"
			on:click={() => (active = !active)}
		>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>
	<div id="mainMenu" class="navbar-menu" class:is-active={active}>
		<div class="navbar-end">
			<div class="navbar-item">
				<div class="buttons">
					<a class="button" href="/">Home</a>
					<a class="button" href="/about">About</a>
					{#if $ndk.activeUser}
						<Avatar userProfile={$ndk.activeUser.profile} />
					{:else}
						<button class="button" on:click={signIn}>Sign In</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</nav>
