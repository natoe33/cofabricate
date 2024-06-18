<script lang="ts">
	export let active = false;

	function closeDialog() {
		active = !active;
	}
</script>

<div class="modal" class:is-active={active}>
	<div class="modal-background"></div>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Login</p>
			<button class="delete" aria-label="close" on:click={closeDialog}></button>
		</header>
		<section class="modal-card-body"></section>
	</div>
</div>
