<script lang="ts">
	import { Image } from "$lib/components/image";

    let { src }: { src: string } = $props();

</script>

<Image {src} omitFigure={true} />