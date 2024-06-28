<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { ndk } from '$lib/stores/nostr';
	import { currentUser } from '$lib/store';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let active = false;

	function signIn() {
		console.debug('signing in');
		dispatch('signin');
	}
</script>

<nav class="navbar" aria-label="main navigation">
	<div class="navbar-brand">
		<h1 class="title is-1">CoFabricate</h1>
		<!-- svelte-ignore a11y-missing-attribute -->
		<button
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
		</button>
	</div>
	<div id="mainMenu" class="navbar-menu" class:is-active={active}>
		<div class="navbar-end">
			<div class="navbar-item">
				<a class="button" href="/">Home</a>
			</div>
			<div class="navbar-item">
				<a class="button" href="/about">About</a>
			</div>
			<div class="navbar-item">
				<button on:click={signIn}>
					<Avatar />
				</button>
			</div>
		</div>
	</div>
	<!-- <div id="mobileMenu" class="navbar-menu is-hidden-desktop" class:is-active={active}>
		<aside class="menu">
		</aside>
	</div> -->
</nav>

<style>
	.nav-menu {
		display: flex;
		flex-direction: column;
	}
</style>
