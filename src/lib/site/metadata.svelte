<script lang="ts">
	import { page } from "$app/stores";
    import { siteConfig } from "./config";

	let title = $derived($page.data?.title ? `${$page.data?.title} – ${siteConfig.name}` : `${siteConfig.title}`);
</script>

<svelte:head>
	<title>{title}</title>
    <meta name="keywords" content={siteConfig.keywords}>
    <meta name="description" content={siteConfig.description}>
    <meta property="og:url" content={siteConfig.url}>
    <meta property="og:type" content="website">
    <meta property="og:image" content={siteConfig.ogUrl}>
	<meta property="og:image:alt" content={title} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content={siteConfig.url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={siteConfig.description} />
    <meta name="twitter:site" content={siteConfig.url}>
    <meta name="twitter:image" content={siteConfig.ogUrl}>
	<meta name="twitter:creator" content="Joost Ramke" />
	<meta name="author" content="Joost Ramke" />
	<link rel="shortcut icon" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/favicon.png" />
</svelte:head>