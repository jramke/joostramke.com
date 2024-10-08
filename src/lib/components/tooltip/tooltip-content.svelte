<script lang="ts">
	import type { WithoutChildrenOrChild } from 'bits-ui';
	import type { Snippet } from 'svelte';

	import { Tooltip as TooltipPrimitive } from 'bits-ui';
	import { flyScaleBlur, type FlyAndScaleParams } from '$lib/transitions';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		children,
		side = 'top',
		...restProps
	}: WithoutChildrenOrChild<TooltipPrimitive.ContentProps> & {
		children?: Snippet;
	} = $props();

	const transition: Record<"top" | "right" | "bottom" | "left", Partial<FlyAndScaleParams>> = {
        top: { y: 8, x: 0 },
        bottom: { y: -8, x: 0 },
        left: { y: 0, x: 8 },
        right: { y: 0, x: -8 },
    };

</script>

<TooltipPrimitive.Content sideOffset={8} bind:ref {...restProps} forceMount={true} {side}>
	{#snippet child({ props, open })}
		{#if open}
			<span 
				class={cn("block")} 
				{...props} 
				transition:flyScaleBlur={{ ...transition[side] }}
			>
				<span class="block border border-border px-2 py-1 text-sm rounded-md bg-background shadow-md max-w-[300px]">
					{props?.side}
					{@render children?.()}
				</span>
				<!-- <TooltipPrimitive.Arrow class="text-background border">
					{#snippet child({ props })}
						<span class={cn("block bg-background rounded-[2px] border-border w-[8px] h-[8px] absolute")}></span>
					{/snippet}
				</TooltipPrimitive.Arrow> -->
			</span>
		{/if}
	{/snippet}
</TooltipPrimitive.Content>
