<script lang="ts">
	// TODO: Rewrite this to use svelte 5 component api
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	import { cn } from '$lib/utils';
	import { ArrowBigUp, CornerDownLeft, Command, Space } from 'lucide-svelte';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let keys: string[] = [];

	type KeysAsIcons = {
		[key: string]: ComponentType<Icon>;
	};
	const keysAsIcons = {
		shift: ArrowBigUp,
		enter: CornerDownLeft,
		command: Command,
		space: Space,
	} as KeysAsIcons;
</script>

<div class={cn('text-xs tracking-widest text-foreground flex items-center gap-0.5', className)}>
	{#each keys as key}
		<kbd class="border border-border size-[20px] bg-background flex items-center justify-center rounded-[4.5px] text-center leading-[20px] transition-all">
			{#if key in keysAsIcons}
				<span class="sr-only">{key}</span>
				{#if key === 'enter' || key === 'space'}
					<svelte:component this={keysAsIcons[key]} class="!size-[12px] stroke-[2.5]" />
				{:else if key === 'command'}
					<svelte:component this={keysAsIcons[key]} class="!size-[11.5px] stroke-[2.5]" />
				{:else}
					<svelte:component this={keysAsIcons[key]} class="!size-[15px] stroke-2" />
				{/if}
			{:else}
				{key}
			{/if}
		</kbd>
	{/each}
</div>
