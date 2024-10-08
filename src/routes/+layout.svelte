<script>
    import "$lib/styles/theme.css";
    import "$lib/styles/import.scss";

    import { UmamiAnalytics } from '@lukulent/svelte-umami';
    import { Metadata, Navigation, Transition, Footer } from "$lib/site";
    import * as Tooltip from "$lib/components/tooltip";

    let { children, data } = $props();

</script>

<Metadata />

<UmamiAnalytics
	websiteID="75d4086f-f166-4182-81c2-489be689d8c1"
	srcURL="https://umami.joostramke.com/script.js"
/>

<Tooltip.Provider delayDuration={200}>
    <div class="flex flex-col min-h-[100vh]">
        <Navigation />
        <main class="flex-grow pt-20 pb-14">
            <Transition key={data.pathname}>
                {@render children()}
            </Transition>
        </main>
        {#if data.pathname !== "/gallery"}
            <Footer />
        {/if}
    </div>
</Tooltip.Provider>

<svg height="0" width="0" style="position:absolute;">
    <defs>
        <clipPath id="external-link-icon-path" clipPathUnits="objectBoundingBox">
            <path d="M0.995,0.04 c-0.007,-0.016,-0.019,-0.029,-0.035,-0.035 c-0.008,-0.003,-0.016,-0.005,-0.025,-0.005 H0.065 C0.029,0,0,0.029,0,0.065 s0.029,0.065,0.065,0.065 H0.777 L0.019,0.889 c-0.025,0.025,-0.025,0.067,0,0.092 c0.013,0.013,0.029,0.019,0.046,0.019 s0.033,-0.006,0.046,-0.019 L0.87,0.223 V0.935 c0,0.036,0.029,0.065,0.065,0.065 s0.065,-0.029,0.065,-0.065 V0.065 c0,-0.008,-0.002,-0.017,-0.005,-0.025"/>
        </clipPath>
    </defs>
</svg>