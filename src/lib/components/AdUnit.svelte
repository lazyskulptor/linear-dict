<script>
	import { onMount } from 'svelte';

	/** @type {{ slot: string, format?: string, responsive?: boolean, style?: string }} */
	let { slot, format = 'auto', responsive = true, style = 'display:block' } = $props();

	onMount(() => {
		try {
			// @ts-ignore
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch {
			// AdSense not loaded
		}
	});
</script>

<ins
	class="adsbygoogle"
	{style}
	data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
	data-ad-slot={slot}
	data-ad-format={format}
	data-full-width-responsive={responsive}
></ins>
