<script lang="ts">
    import { page } from '$app/stores';
	import { cn } from '$lib/utils';
    import { mainPages } from '$lib/site';
	import Offcanvas from './navigation-offcanvas.svelte';
	import { setNavigationState } from './state.svelte';

    setNavigationState();

</script>

<div class="content-grid">
    <nav class="breakout-lg">
        <div class="z-[7] relative pointer-events-none py-8 lg:py-10 flex gap-10 justify-between items-center">
            {@render branding()}
        
            <ul class="flex gap-4 max-[622px]:hidden">
                {#each mainPages as { slug, title, target }}
                    {@render navitem(slug, title, target)}
                {/each}
            </ul>
        </div>
    
        <Offcanvas />
    </nav>
</div>

<!-- TODO: motion-reduce -->
{#snippet branding()}
    <a 
        href="/" 
        class="group flex items-center h-10 font-medium gap-2 outline-none relative pointer-events-auto"
    >
        <div class="absolute inset-0 size-full rounded-md group-focus-visible:ring-foreground group-focus-visible:ring-offset-1 group-focus-visible:ring-2"></div>
        <span class="sr-only">Joost Ramke - Design Engineer</span>
        <div aria-hidden="true" style="transform: translateZ(0); backface-visibility: hidden;" class={cn(
            `size-8 rounded-full relative transition-all overflow-hidden spring-bounce-[27] spring-duration-[250]
            group-hover:scale-100 group-hover:size-10 group-hover:bg-transparent group-hover:spring-bounce-[40] group-hover:spring-duration-300 
            group-focus-visible:scale-100 group-focus-visible:size-10 group-focus-visible:bg-transparent group-focus-visible:spring-bounce-[40] group-focus-visible:spring-duration-300`
        )}>
            <enhanced:img src="/src/assets/me.jpg?w=50" class="size-full object-cover object-[center_top]" alt="" />
        </div>
        <div aria-hidden="true" class="relativ flex translate-y-[1px]" style="clip-path: inset(0% -20% 0% -5%);">
            <span class={cn(
                `inline-block absolute whitespace-nowrap transition-all scale-x-100 origin-left spring-bounce-[30] spring-duration-300 
                group-hover:translate-x-[50%] group-hover:opacity-0 group-hover:scale-x-[180%] 
                group-focus-visible:translate-x-[50%] group-focus-visible:opacity-0 group-focus-visible::scale-x-[180%]`
            )}>
                Joost Ramke
            </span>
            <span aria-hidden="true" class={cn(
                `inline-block transition-all -translate-x-full opacity-0 scale-x-[200%] origin-right spring-bounce-[30] spring-duration-300
                group-hover:opacity-100 group-hover:translate-x-[0px] group-hover:scale-x-100  
                group-focus-visible:opacity-100 group-focus-visible:translate-x-[0px] group-focus-visible:scale-x-100`
            )}>
                Design Engineer
            </span>
        </div>
    </a>
{/snippet}

{#snippet navitem(slug: string, title: string, target: string | null)}
    <li>
        <a 
            href={slug} 
            {target} 
            data-no-external-icon 
            class={cn(
                "font-medium relative px-2 py-1.5 rounded-lg outline-none pointer-events-auto",
                "transition-all motion-reduce:transition-none",
                "after:transition-all after:spring-bounce-[50] after:spring-duration-200 motion-reduce:after:transition-none",
                "after:absolute after:inset-0 after:bg-foreground after:-z-10 after:rounded-md after:scale-75 after:opacity-0",
                "hover:after:scale-100 hover:after:opacity-100 hover:text-background",
                "focus-visible:after:scale-100 focus-visible:after:opacity-100 focus-visible:text-background", 
                $page.route.id === slug && "after:opacity-100 after:scale-100 text-background"
            )}
        >
            {title}
        </a>
    </li>
{/snippet}