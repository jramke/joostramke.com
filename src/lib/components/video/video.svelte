<script lang="ts">

    import type { HTMLVideoAttributes } from 'svelte/elements'

    type Props = {
        src: string;
        autoplay?: boolean;
        muted?: boolean;
        loop?: boolean;
        figcaption?: string;
    } & Omit<HTMLVideoAttributes, 'src' | 'autoplay' | 'muted' | 'loop'>;

    let { src , autoplay, muted, loop, figcaption, ...restProps }: Props = $props();

</script>

<figure>
    <video {autoplay} {muted} {loop} {...restProps} playsinline webkit-playsinline>
        <source src={src} type="video/mp4">
    </video>
    {#if figcaption}
        <figcaption>{figcaption}</figcaption>
    {/if}
</figure>