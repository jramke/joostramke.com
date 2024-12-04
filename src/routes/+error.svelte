<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="content-grid prose">
	<h1>{$page.status}: {$page.error?.message}</h1>
	<p>Hey, you seem a little bit lost. <a href="/">Back home</a>.</p>
</div>
