<script lang="ts">
	import { elasticDiv } from "$lib/actions";
    import { legalsPages, footerPages, socialPages } from "$lib/site";

    import Signature from "$assets/signature.png";

</script>

<div class="relative z-[6]">
    <div use:elasticDiv class="bg-foreground text-background font-[300]">
        <footer class="content-grid pt-20" style="--selection-blur-color: hsl(var(--background))">
            <div class="breakout-lg">
                <div class="grid gap-y-16 grid-cols-2 md:grid-cols-4">
                    <div class="col-span-2">
                        <!-- <img id="wave" data-aos-delay="1800" class="size-6 inline-block -mt-[5px]" src="/peace.png" alt="Peace emoji"> -->
                        <h2 class="font-medium">
                            Thanks for checking by 
                        </h2>
                        <img src={Signature} alt="Signature 'Joost'" width="150" class="w-[150px] invert mt-4" />
                    </div>
                    <div>
                        <h2 class="font-medium mb-1">Pages</h2>
                        <ul>
                            {#each footerPages as { slug, title, target }}
                                <li>
                                    {@render footerNavItem(slug, title, target)}
                                </li>
                            {/each}
                        </ul>
                    </div>
                    <div>
                        <h2 class="font-medium mb-1">Socials</h2>
                        <ul>
                            {#each socialPages as { slug, title, target }}
                                <li>
                                    <!-- TODO: copy mail interaction -->
                                    {#if slug.includes('mailto')}
                                        <a href={slug} class="group">
                                            <span class="opacity-65 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                                {title}
                                            </span>
                                        </a>
                                    {:else}
                                        {@render footerNavItem(slug, title, target)}
                                    {/if}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
                <div class="flex gap-4 text-sm justify-between items-center mt-12 py-4 border-border/10 border-t">
                    <span class="opacity-65">
                        <span role="img" aria-label="Copyright">©</span>
                        Joost Ramke 2024
                    </span>
                    <div class="flex gap-4 items-center">
                        {#each legalsPages as { slug, title, target }}
                            {@render footerNavItem(slug, title, target)}
                        {/each}
                    </div>
                </div>
            </div>
        </footer>
    </div>
</div>


{#snippet footerNavItem(slug: string, title: string, target: string | null)}
    <a href={slug} class="text-background/65 transition-all hover:text-background focus-visible:text-background hover:font-[500] focus-visible:font-[500]" {target}>
        <span>{title}</span>
    </a>
{/snippet}