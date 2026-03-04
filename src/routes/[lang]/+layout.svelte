<script>
	import { page } from '$app/stores';
	import { languages, languagesBySlug, SITE_URL } from '$lib/config/languages.js';

	let { children } = $props();

	let langConfig = $derived(languagesBySlug[$page.params.lang]);
</script>

<svelte:head>
	{#if langConfig}
		<title>{langConfig.seo.title}</title>
		<meta name="description" content={langConfig.seo.description} />
		<meta name="keywords" content={langConfig.seo.keywords} />

		<!-- Open Graph -->
		<meta property="og:type" content="website" />
		<meta property="og:title" content={langConfig.seo.title} />
		<meta property="og:description" content={langConfig.seo.description} />
		<meta property="og:site_name" content="Linear Dict" />
		<meta property="og:url" content={`${SITE_URL}/${langConfig.slug}`} />
		<meta property="og:image" content={`${SITE_URL}/og-image.png`} />

		<!-- Twitter Card -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={langConfig.seo.title} />
		<meta name="twitter:description" content={langConfig.seo.description} />
		<meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

		<meta name="robots" content="index, follow" />
		<link rel="canonical" href={`${SITE_URL}/${langConfig.slug}`} />

		<!-- hreflang alternates -->
		{#each languages as lang}
			<link rel="alternate" hreflang={lang.iso} href={`${SITE_URL}/${lang.slug}`} />
		{/each}
		<link rel="alternate" hreflang="x-default" href={`${SITE_URL}/english`} />

		<!-- JSON-LD -->
		{@html `<script type="application/ld+json">${JSON.stringify({
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Linear Dict",
			"alternateName": "Linear Dictionary",
			"description": langConfig.seo.description,
			"url": `${SITE_URL}/${langConfig.slug}`,
			"applicationCategory": "UtilitiesApplication",
			"operatingSystem": "Any",
			"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
			"inLanguage": languages.map(l => l.iso)
		})}</script>`}
	{/if}
</svelte:head>

{@render children()}
