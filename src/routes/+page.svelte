<script lang="ts">
	import { page } from '$app/stores';
	import { wave } from '$lib/actions/wave';
	import Image from '$lib/components/image/image.svelte';
	import { Slider } from '$lib/components/slider';
	import { pages } from '$lib/site';

	import Wave from '$assets/wave.png';

	const sliderItems = $page.data.projects.highlights;
</script>

<section class="content-grid" aria-label="hello">
	<div class="animate-fade-in-bottom">
		<h1 class="inline-block font-medium">
			Hello, I'm Joost
			<img use:wave src={Wave} class="size-6 inline-block ml-1 -mt-[5px]" alt="Waving emoji" />
		</h1>
		<p class="text-balance text-secondary prose">
			a developer & designer crafting digital experiences that seamlessly blend form and function. Currently working at
			<a href="https://www.weareslim.de/" target="_blank">weareslim</a>.
		</p>
	</div>
</section>

<section class="content-grid pt-section" aria-label="projects">
	<div class="prose animate-fade-in-bottom [animation-delay:200ms]">
		<h2 class="mb-0">Projects</h2>
		<p>Some of my recent side projects. You can find more on the <a href={pages.projects.slug}>{pages.projects.title.toLowerCase()}</a> page.</p>
	</div>
	<div class="pt-section-inner full-width">
		<Slider items={sliderItems} />
	</div>
</section>
