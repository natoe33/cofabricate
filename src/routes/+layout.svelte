<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import LoginModal from '$lib/components/LoginModal/Modal.svelte';
	import { login } from "$lib/utils/login";
	import { browserSetup } from "./browser-setup";
	import { onMount } from 'svelte';

	let modalActive = false;

	onMount(async () => {
		await signIn();
	});

	function toggleModal() {
		modalActive=!modalActive;
	}
	async function signIn() {
		browserSetup();
	}
</script>

<NavBar on:signin={toggleModal} />
<slot></slot>
<LoginModal active={modalActive} on:toggleModal={toggleModal} />
