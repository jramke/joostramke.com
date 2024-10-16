<script lang="ts">
	import { Image } from '$lib/components/image';
	import { Github, Globe } from 'lucide-svelte';

    let { data } = $props();    

</script>

<section>
    <div class="content-grid">
        <h1 class="font-semibold mb-8">{data.meta.title}</h1>
        <dl class="grid sm:grid-cols-3 gap-4">
            {@render projectInfo('Service', data.meta.tags.join(", "))}
            {@render projectInfo('Client', data.meta.client)}
            {@render projectInfo('Year', ''+new Date(data.meta.date).getFullYear())}
        </dl>
        <div>
            {#if data.meta.externalLink}
                <a href={data.meta.externalLink} class="text-link mt-8" data-no-external-icon target="_blank">
                    <Globe class="size-[1rem] inline-block translate-y-[-2px]" aria-hidden="true" />
                    Visit live site
                </a>
            {/if}
            {#if data.meta.githubLink && data.meta.externalLink}
                <span class="text-secondary text-sm mx-2">or</span>
            {/if}
            {#if data.meta.githubLink}
                <a href={data.meta.githubLink} class="text-link mt-8" data-no-external-icon target="_blank">
                    <Github class="size-[1rem] inline-block translate-y-[-2px]" aria-hidden="true" />
                    View on Github
                </a>
            {/if}
        </div>
        <div class="breakout mt-section-inner">
            <Image 
                src={data.meta.thumbnail} 
                class="aspect-[1.2] w-full h-full object-cover flip-target" 
                data-flip-id="thumbnail-{data.meta.slug}" 
                alt={data.meta.thumbnailAlt} 
            />
        </div>
    </div>
    {#if data.content}
        <div class="content-grid prose mt-section-inner">
            <data.content />
        </div>
    {/if}
</section>

<section class="mt-section-inner">
    <div class="content-grid prose">
        <div>
            <button onclick={() => history.back()} class="text-link">
                <!-- <ChevronLeft class="size-[1.15rem] inline-block translate-y-[-1px]" aria-hidden="true" /> -->
                Go back
            </button>
        </div>
    </div>
</section>

{#snippet projectInfo(name: string, value: string)}
    <div class="">
        <dt class="text-secondary">{name}</dt>
        <dd>{value}</dd>
    </div>
{/snippet}