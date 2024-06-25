<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Nip07Button from "./Nip07Button.svelte";

	export let active = false;

	const dispatch = createEventDispatcher();

	function toggleModal() {
		dispatch('toggleModal');
	}
</script>

<div class="modal" class:is-active={active}>
	<div class="modal-background"></div>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Login</p>
			<button class="delete" aria-label="close" on:click={toggleModal}></button>
		</header>
		<section class="modal-card-body">
			<Nip07Button on:closeModal={toggleModal}/>
		</section>
	</div>
</div>
