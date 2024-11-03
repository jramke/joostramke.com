<script lang="ts">
	import type { Picture } from "$lib/types";
	import { Image } from "$lib/components/image";

    let { src }: { src: Picture } = $props();

</script>

<Image image={src} omitFigure={true} />