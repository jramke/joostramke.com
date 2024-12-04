<script lang="ts">
	import { hoverImage } from '$lib/actions/hover-image';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let workItems = $state(data.projects.latest);
	// let isArchiveShown = $state(false);

	// function toggleArchiveProjects() {
	//     isArchiveShown ? removeArchiveProjects() : addArchiveProjects();
	// }

	// function addArchiveProjects() {
	//     workItems.push(...data.projects.archived);
	//     isArchiveShown = true;
	// }

	// function removeArchiveProjects() {
	//     workItems = data.projects.latest;
	//     isArchiveShown = false;
	// }
</script>

<section>
	<div class="content-grid prose">
		<h1>Projects</h1>
		<p>
			Some ideas I transformed into nice digital experiences. An overview over my recent projects i did in the last years. You can find more work at
			<a href="https://brainworxx.de" target="_blank">Brainworxx</a> and explore what we did as team so far.
		</p>
		<div class="not-prose mt-section-inner">
			<ul>
				{#each workItems as { title, slug, thumbnail, date, tags }, i}
					<li>
						<a
							href={'projects/' + slug}
							class="block text-foreground py-3 group group"
							use:hoverImage={{ image: thumbnail, zIndex: 1, attributes: { 'data-flip-id': `thumbnail-${slug}` } }}
						>
							<div class="flex gap-4 justify-between items-center">
								<h2
									class={cn(
										'font-medium whitespace-nowrap spring-bounce-40 transition-[padding,margin,font-weight] spring-duration-300',
										'group-hover:z-[2] group-hover:mix-blend-difference group-hover:invert',
										'group-hover:motion-safe:-ml-1.5 group-focus-visible:motion-safe:-ml-1.5',
										'group-hover:font-[600] group-focus-visible:font-[600]',
									)}
								>
									{title}
								</h2>
								<div
									aria-hidden="true"
									class="bg-border transition-colors h-[1px] w-full group-hover:bg-foreground/50 group-focus-visible:bg-foreground/50"
								></div>
								<span
									class={cn(
										'inline-block text-secondary text-sm spring-bounce-40 spring-duration-300 transition-spacing',
										'group-hover:motion-safe:-mr-1.5 group-focus-visible:motion-safe:-mr-1.5',
									)}
								>
									{new Date(date).getFullYear()}
								</span>
							</div>
							<p class="text-secondary text-sm">{tags.join(', ')}</p>
						</a>
					</li>
				{/each}
			</ul>
		</div>
		<!-- <div class="text-center">
            <button class="text-link text-secondary text-sm" onclick={toggleArchiveProjects}>
                {#if !isArchiveShown}
                    View archive projects
                {:else}
                    Hide archive projects
                {/if}
            </button>
        </div> -->
	</div>
</section>
