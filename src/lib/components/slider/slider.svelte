<script lang="ts">
	import { motionSwiper } from "$lib/actions";
	import type { Project } from "$lib/types";
	import { cn } from "$lib/utils";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
    import { Image } from "$lib/components/image";

    let { items }: { items: Project[] } = $props();

</script>

<!-- TODO: ally (role, motion, alt-tags, ...) -->
<!-- TODO: image on right renders too late sometimes -->
<div class={cn(
    "overflow-hidden -mt-[var(--swiper-slide-spacing)]",
    "[--swiper-height:15rem;] [--swiper-slide-width:15rem;] [--swiper-slide-spacing:1.5rem;]",
    "md:[--swiper-slide-width:25rem;] md:[--swiper-height:25rem;]"
)}>
    <div 
        class="group motion-swiper relative w-full h-[var(--swiper-height)] mt-[var(--swiper-slide-spacing)] mb-8 cursor-grab data-[dragging]:cursor-grabbing"
        use:motionSwiper={{ swipeOnClick: false }}
    >
        <div class="absolute top-0 left-0 h-full flex">
            {#each items as item}
                <div 
                    data-motion-swiper-item
                    class="relative flex-shrink-0 w-[var(--swiper-slide-width)] h-full select-none px-[calc(var(--swiper-slide-spacing)/2)]"
                    data-cursor-text={item.title}
                >
                    <a 
                        href={'projects/' + item.slug} 
                        class="peer block place-items-center size-full cursor-[inherit] group-data-[dragging]:pointer-events-none" 
                        draggable="false"
                        data-motion-swiper-inner
                    >
                        <div class="size-full" data-flip-id="thumbnail-{item.slug}">
                            <Image 
                                image={item.thumbnail} 
                                alt={item.thumbnailAlt || ""} 
                                class="object-cover size-full pointer-events-none select-none"
                                omitFigure={true}
                            />
                        </div>
                    </a>
                    <div class={cn(
                        "absolute pointer-events-none inset-0 z-10 border-foreground border-0 rounded-md flex items-end justify-center -mt-[calc(var(--swiper-slide-spacing)/2)] -mb-[calc((var(--swiper-slide-spacing)/2)+1.25rem)]", 
                        "peer-focus-visible:border-2",
                        "peer-hover:[&>span]:underline peer-hover:[&>span]:underline-offset-2",
                    )}>
                        <span class="text-sm">{item.title}</span>
                    </div>
                </div>
            {/each}
        </div>
        <div class="absolute z-10 w-full px-4 top-[50%] translate-y-[-50%] flex items-center justify-between pointer-events-none">
            <button 
                data-motion-swiper-prev 
                class={cn(
                    "border-border border shadow-md bg-background p-1 pointer-events-auto rounded-md opacity-0 scale-50 spring-bounce-40 spring-duration-200",
                    "group-hover:opacity-100 group-hover:scale-100",
                    "group-focus-within:opacity-100 group-focus-within:scale-100"
                )}
            >
                <ChevronLeft aria-hidden="true" class="size-5" />
                <div class="sr-only">Scroll left</div>
            </button>
            <button 
                data-motion-swiper-next 
                class={cn(
                    "border-border border shadow-md bg-background p-1 pointer-events-auto rounded-md opacity-0 scale-50 spring-bounce-40 spring-duration-200",
                    "group-hover:opacity-100 group-hover:scale-100",
                    "group-focus-within:opacity-100 group-focus-within:scale-100"
                )}
            >
                <ChevronRight aria-hidden="true" class="size-5" />
                <div class="sr-only">Scroll right</div>
            </button>
        </div>
    </div>
</div>
