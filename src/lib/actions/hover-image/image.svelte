<script lang="ts">
	import type { Picture } from '$lib/types';
	import { Image } from '$lib/components/image';

	let { image }: { image: Picture } = $props();
</script>

<Image {image} omitFigure={true} />
