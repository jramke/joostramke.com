<script module>

    // We unfortunately cant move the paths where images can be located into a variable
    // Importing all images might seem inefficient, but everything will be prerendered and bundled at build time, so it doesn’t matter.
    // If there is a better way to handle this, with dynamic image paths from eg markdown metadatas, please let me know.
	const images = import.meta.glob(
        [
            '/src/projects/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
            '/src/gallery/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
            '/src/assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}'
        ], 
        {
            eager: true,
            query: { enhanced: true }
        }
    );

    const placeholderImages = import.meta.glob(
        [
            '/src/projects/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
            '/src/gallery/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
            '/src/assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}'
        ], 
        {
            eager: true,
            query: { w: 10, blur: 1 }
        }
    );

	const getImage = (src: string, images: Record<string, any>) => {
        if (!src.startsWith('/')) {
            throw new Error('Image path must be absolute');
        }
        const image = images[src] as { default: string };
        
        if (!image) {
            throw new Error(`Image not found: ${src}`);
        }
        
		return image.default;
	};

</script>

<script lang="ts">
	
    import type { HTMLImgAttributes } from 'svelte/elements'

    type Props = {
        src: string;
        alt?: string;
        figcaption?: string;
        omitFigure?: boolean;
    } & Omit<HTMLImgAttributes, 'src' | 'alt'>;

    let { src, alt, figcaption, omitFigure, ...restProps }: Props = $props();

	const image = getImage(src, images);
    
    const placeholderUrl = getImage(src, placeholderImages);
    const style = `background-image: url('${placeholderUrl}'); background-size: cover; background-repeat: no-repeat;`;

</script>

<svelte:head>
	<link rel="preload" as="image" href={placeholderUrl} fetchpriority="high" />
</svelte:head>

{#if omitFigure}
    {@render imageSnippet()}
{:else}
    <figure>
        {@render imageSnippet()}
    </figure>
{/if}

{#snippet imageSnippet()}
    <enhanced:img src={image} {alt} {...restProps} {style} />
    {#if figcaption}
        <!-- svelte-ignore a11y_figcaption_parent -->
        <figcaption>{figcaption}</figcaption>
    {/if}
{/snippet}