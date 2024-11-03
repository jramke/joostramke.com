<script lang="ts">
	import type { Picture } from "$lib/types";
	import { Image } from "$lib/components/image";

    let { src }: { src: string } = $props();

</script>

<Image src={src} omitFigure={true} />