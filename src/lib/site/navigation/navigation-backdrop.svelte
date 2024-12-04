<script lang="ts">
	import { fade } from 'svelte/transition';

	interface NavigationBackdropProps {
		onclick: () => void;
	}
	let { onclick }: NavigationBackdropProps = $props();
</script>

<div in:fade={{ duration: 300 }} out:fade={{ duration: 500 }} tabindex="-1" role="presentation" class="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" {onclick}></div>
