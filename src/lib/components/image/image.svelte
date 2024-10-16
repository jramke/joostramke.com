<script lang="ts">
	// import type { Picture } from '$lib/types';
	import type { HTMLImgAttributes } from 'svelte/elements'

    type Props = {
        src: string;
        alt?: string;
        figcaption?: string;
        omitFigure?: boolean;
    } & Omit<HTMLImgAttributes, 'src' | 'alt'>;

    let { src, alt, figcaption, omitFigure, ...restProps }: Props = $props();

</script>

{#if omitFigure}
    {@render imageSnippet()}
{:else}
    <figure>
        {@render imageSnippet()}
    </figure>
{/if}

{#snippet imageSnippet()}
    <!-- <enhanced:img src={image} {alt} {...restProps} /> -->
    <img {src} {alt} {...restProps} />
    {#if figcaption}
        <!-- svelte-ignore a11y_figcaption_parent -->
        <figcaption>{figcaption}</figcaption>
    {/if}
{/snippet}