<script lang="ts">
	import { photogrid } from "$lib/actions/photogrid";
	import { Image } from "$lib/components/image";
	import { cn } from "$lib/utils/index.js";

    let { data } = $props();

    const gridPositions = [
        '17 / 32 / 32 / 38',
        '13 / 11 / 23 / 19',
        '28 / 15 / 42 / 20',
        '10 / 1 / 26 / 7',
        '1 / 21 / 10 / 25',
        '1 / 36 / 14 / 42',
        '20 / 46 / 28 / 50',
        '35 / 3 / 45 / 7',
        '40 / 26 / 50 / 32',
        '37 / 39 / 48 / 42'
    ] as const;

</script>

<section>
    <div class={cn(
        "lg:fixed top-0 left-0 lg:h-[100vh] lg:w-full overflow-hidden flex justify-center items-center z-[6]",
        ""
    )}>
        <div class="lg:flex justify-center items-center flex-col lg:size-full max-lg:container">
            <div class="prose mb-section-inner lg:text-center lg:m-0 max-w-[400px]">
                <h1>
                    Photography
                </h1>
                <p>Most of the shots where taken with 35mm film and others are shot with a Sony A7II or my iPhone</p>
            </div>
            <div use:photogrid class="opacity-0 grid gap-8 lg:absolute lg:w-[150%] lg:h-[150%] lg:top-[50%] lg:left-[50%] lg:gap-0 lg:grid-cols-[repeat(50,2%)] lg:grid-rows-[repeat(50,2%)] lg:p-[60px] max-lg:!transform-none">
                {#each data.gallery as item, i}
                    <button data-photogrid-item class="relative flex justify-center items-center cursor-zoom-in max-lg:!transform-none max-lg:![grid-area:auto]" style={`grid-area: ${gridPositions[i]}`}>
                        <div data-photogrid-item-inner-wrapper>
                            <Image data-photogrid-item-inner data-url={item.print} image={item.image} alt="" class="max-lg:![clip-path:none]" />
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    </div>
    <div 
        data-photogrid-lightbox 
        data-open="false" 
        class={cn(
            "fixed top-0 left-0 h-[100vh] w-full size-full flex justify-center items-center z-50 group pointer-events-none px-8",
            "data-[open=true]:pointer-events-auto",
            "[&_[data-photogrid-item-inner-wrapper]]:h-[80%] [&_[data-photogrid-item-inner-wrapper]]:flex [&_[data-photogrid-item-inner-wrapper]]:cursor-zoom-out [&_[data-photogrid-item-inner-wrapper]]:z-[1]",
            "[&_img]:h-full [&_img]:w-auto [&_img]:!bg-none [&_img]:object-contain"
        )}
    >
        <div 
            aria-hidden="true" 
            class={cn(
                "absolute inset-0 opacity-0 pointer-events-none transition-all duration-300",
                "group-data-[open=true]:opacity-100 group-data-[open=true]:backdrop-blur-sm group-data-[open=true]:bg-black/50"
            )}
        ></div>
    </div>

</section>

<style>
    :global(body:has([data-photogrid-lightbox][data-open=true])) {
        overflow: hidden;
    }
</style>