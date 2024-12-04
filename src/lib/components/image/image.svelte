<script lang="ts">
	import type { Picture } from '$lib/types';
	import type { HTMLImgAttributes } from 'svelte/elements';

	type Props = {
		src?: string;
		image?: Picture;
		alt?: string;
		figcaption?: string;
		omitFigure?: boolean;
	} & Omit<HTMLImgAttributes, 'src' | 'alt'>;

	let { src, image, alt, figcaption, omitFigure, ...restProps }: Props = $props();
</script>

{#if omitFigure}
	{@render imageSnippet()}
{:else}
	<figure>
		{@render imageSnippet()}
	</figure>
{/if}

{#snippet imageSnippet()}
	{@render errorHandling()}

	{#if image}
		<enhanced:img src={image} {alt} {...restProps} />
	{:else}
		<img {src} {alt} {...restProps} />
	{/if}

	{#if figcaption}
		<!-- svelte-ignore a11y_figcaption_parent -->
		<figcaption>{figcaption}</figcaption>
	{/if}
{/snippet}

{#snippet errorHandling()}
	{#if !src && !image}
		<p>Image not found</p>
	{/if}
	{#if src && image}
		<p>Both src and image provided, using image</p>
	{/if}
{/snippet}
