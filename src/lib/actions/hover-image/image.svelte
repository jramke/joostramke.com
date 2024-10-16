<script lang="ts">
	import { Image } from "$lib/components/image";
	// import type { Picture } from "$lib/types";

    let { src }: { src: string } = $props();

</script>

<Image {src} omitFigure={true} />