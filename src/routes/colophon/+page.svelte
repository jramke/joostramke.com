<script lang="ts">
	import { pages } from '$lib/site';
</script>

<section>
	<div class="content-grid prose">
		<h1>Colophon</h1>
		<p>
			Some insights on how this site is built and maintained. You can find the code <a href="https://github.com/jramke/joostramke.com" target="_blank">here</a>. If
			you like it i would be happy if you give it a star. For any questions or feedback feel free to reach out to me
			<a href={pages.twitter.slug} data-no-external-icon target="_blank">@{pages.twitter.slug.split('/').at(-1)}</a>.
		</p>
		<h2>Tech Stack</h2>
		<p>I wanted to keep this project somewhat minimal and ensure that the site is statically rendered to keep it fast and efficient.</p>
		<dl class="not-prose list-disc space-y-1 ml-7">
			{@render infolist('Framework', [['Svelte with SvelteKit', 'https://kit.svelte.dev/']])}
			{@render infolist('CSS Framework', [['Tailwind CSS', 'https://tailwindcss.com/']])}
			{@render infolist('Markdown Content', [['mdsvex', 'https://github.com/pngwn/MDsveX']])}
			{@render infolist('Animations', [
				['Svelte Transitions', 'https://svelte.dev/docs/svelte-transition'],
				['GSAP', 'https://gsap.com/'],
				['tailwindcss-spring', 'https://tailwindcss-spring.kvin.me/'],
			])}
			{@render infolist('Analytics', [['Umami', 'https://umami.is/']])}
		</dl>
		<h2>Typography</h2>
		<p>
			Yes, i used <a href="https://rsms.me/inter/" target="_blank">Inter</a>. Shame on me. But you know what, i wanted to also finish this site at some point, so i
			came back to basics.
		</p>
		<h2>Iconography</h2>
		<p>
			The icons are from <a href="https://lucide.dev/" target="_blank">Lucide</a>. They provide a nice and consistent style with a grat DX and real SVGs are waaaay
			better to work with than some icon fonts.
		</p>
		<h2>Hosting</h2>
		<p>
			The site is hosted on a simple <a href="https://www.hetzner.com/de/" target="_blank">Hetzner</a> VPS running
			<a href="https://coolify.io/" target="_blank">Coolify</a>.
		</p>
		<p class="font-handwriting text-2xl">Cheers!</p>
	</div>
</section>

{#snippet infolist(name: string, valueLinkPairs: [string, string][])}
	<div class="list-item marker:text-[var(--tw-prose-bullets)]">
		<dt class="inline">{name}:</dt>
		<dd class="inline">
			{#each valueLinkPairs as [value, link], i}
				<a href={link} target="_blank">{value}</a>
				{#if i < valueLinkPairs.length - 1}
					&{' '}{/if}
			{/each}
		</dd>
	</div>
{/snippet}
