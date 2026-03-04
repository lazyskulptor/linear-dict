<script>
	import InterlinearDisplay from '$lib/components/InterlinearDisplay.svelte';
	import AdUnit from '$lib/components/AdUnit.svelte';
	import { mapWordsToOriginalText } from '$lib/utils/tokenizer.js';

	let text = $state('');
	let sourceLang = $state('English');
	let targetLang = $state('한국어');
	let loading = $state(false);
	let error = $state('');
	/** @type {Array<{original: string, meaning?: string, dict?: string, pos?: string, isWhitespace?: boolean, unmatched?: boolean}> | null} */
	let words = $state(null);
	/** @type {AbortController | null} */
	let abortController = $state(null);

	const MAX_LENGTH = 20000;

	const languages = [
		{ value: 'English', label: 'English (English)' },
		{ value: '中文', label: '中文 (Chinese)' },
		{ value: '日本語', label: '日本語 (Japanese)' },
		{ value: '한국어', label: '한국어 (Korean)' },
		{ value: 'Español', label: 'Español (Spanish)' },
		{ value: 'Français', label: 'Français (French)' },
		{ value: 'Deutsch', label: 'Deutsch (German)' },
		{ value: 'Русский', label: 'Русский (Russian)' },
		{ value: 'עברית מקראית', label: 'עברית מקראית (Biblical Hebrew)' },
		{ value: 'Ἑλληνικὴ Κοινή', label: 'Ἑλληνικὴ Κοινή (Biblical Greek)' }
	];

	function cancelAnalysis() {
		if (abortController) {
			abortController.abort();
			abortController = null;
			loading = false;
		}
	}

	async function analyze() {
		if (!text.trim()) return;

		cancelAnalysis();

		abortController = new AbortController();
		loading = true;
		error = '';
		words = null;

		try {
			const res = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, sourceLang, targetLang }),
				signal: abortController.signal
			});

			// Non-streaming error responses (400, 500 before stream starts)
			if (!res.ok) {
				const data = await res.json();
				error = data.error || 'An error occurred during analysis.';
				return;
			}

			// Read NDJSON stream
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			let allWords = [];

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop();

				for (const line of lines) {
					if (!line.trim()) continue;
					const data = JSON.parse(line);
					if (data.error) {
						error = data.error;
						continue;
					}
					allWords = [...allWords, ...data.words];
					words = mapWordsToOriginalText(text, allWords);
				}
			}

			// Process any remaining data in buffer
			if (buffer.trim()) {
				const data = JSON.parse(buffer);
				if (data.error) {
					error = data.error;
				} else {
					allWords = [...allWords, ...data.words];
					words = mapWordsToOriginalText(text, allWords);
				}
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') {
				return;
			}
			error = 'A network error occurred.';
		} finally {
			abortController = null;
			loading = false;
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			analyze();
		}
		if (e.key === 'Escape' && loading) {
			cancelAnalysis();
		}
	}
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "Linear Dict",
		"alternateName": "Linear Dictionary",
		"description": "Free online word-by-word interlinear translation and dictionary analysis tool supporting 10 languages including Biblical Hebrew and Koine Greek.",
		"url": "https://linear.sooda.life",
		"applicationCategory": "UtilitiesApplication",
		"operatingSystem": "Any",
		"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
		"inLanguage": ["en", "zh", "ja", "ko", "es", "fr", "de", "ru", "hbo", "grc"]
	})}</script>`}
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-8">
	<header class="mb-8 text-center">
		<h1 class="text-3xl font-bold text-primary-900">Linear Dict</h1>
		<p class="mt-2 text-sm text-primary-500">Word-by-word Interlinear Translation & Dictionary</p>
	</header>

	<div class="flex gap-6">
		<!-- Main content -->
		<div class="min-w-0 flex-1">
			<div class="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
				<div class="mb-4 flex gap-4">
					<label class="flex flex-1 flex-col gap-1">
						<span class="text-xs font-medium text-primary-600">Source Language</span>
						<select
							bind:value={sourceLang}
							class="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
						>
							{#each languages as lang}
								<option value={lang.value}>{lang.label}</option>
							{/each}
						</select>
					</label>

					<label class="flex flex-1 flex-col gap-1">
						<span class="text-xs font-medium text-primary-600">Target Language</span>
						<select
							bind:value={targetLang}
							class="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
						>
							{#each languages as lang}
								<option value={lang.value}>{lang.label}</option>
							{/each}
						</select>
					</label>
				</div>

				<div class="relative">
					<textarea
						bind:value={text}
						onkeydown={handleKeydown}
						maxlength={MAX_LENGTH}
						placeholder="Enter text to analyze..."
						rows="4"
						class="w-full resize-none rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 pr-9 text-primary-900 placeholder:text-primary-300 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
					></textarea>
					{#if text}
						<button
							onclick={() => { text = ''; words = null; error = ''; }}
							class="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-primary-300 transition-colors hover:bg-primary-100 hover:text-primary-500"
							title="Clear text"
						>
							<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
								<path d="M18 6L6 18M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>

				<div class="mt-3 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<span class="text-xs text-primary-400">
							{#if loading}
								Press Esc to stop
							{:else}
								Ctrl+Enter (Cmd+Enter) to analyze
							{/if}
						</span>
						<span class="text-xs {text.length >= MAX_LENGTH ? 'text-red-400' : 'text-primary-300'}">{text.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}</span>
					</div>
					{#if loading}
						<button
							onclick={cancelAnalysis}
							class="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
						>
							<span class="inline-flex items-center gap-2">
								<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									></path>
								</svg>
								Stop
							</span>
						</button>
					{:else}
						<button
							onclick={analyze}
							disabled={!text.trim()}
							class="rounded-lg bg-primary-800 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Analyze
						</button>
					{/if}
				</div>
			</div>

			{#if error}
				<div class="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			{/if}

			{#if words}
				<div class="mt-6 rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
					<h2 class="mb-2 text-sm font-medium text-primary-500">Results</h2>
					<InterlinearDisplay {words} />
				</div>
			{/if}

			<!-- Bottom ad -->
			<div class="mt-6">
				<AdUnit slot="5718472634" format="horizontal" />
			</div>
		</div>

		<!-- Right sidebar ad (hidden on mobile) -->
		<aside class="hidden w-[160px] shrink-0 lg:block">
			<div class="sticky top-8">
				<AdUnit slot="8082939182" format="vertical" />
			</div>
		</aside>
	</div>

	<footer class="mt-12 border-t border-primary-100 pt-8 pb-6 text-center text-xs text-primary-400">
		<section class="mx-auto max-w-2xl">
			<h2 class="mb-2 text-sm font-medium text-primary-500">About Linear Dict</h2>
			<p>
				Linear Dict is a free interlinear translation tool that breaks down any text word by word.
				Each word is displayed with its contextual translation, dictionary definition, and part of speech.
				Supports English, Chinese, Japanese, Korean, Russian, Spanish, French, German, Biblical Hebrew, and Biblical Greek (Koine).
			</p>
		</section>
		<p class="mt-4">&copy; {new Date().getFullYear()} Linear Dict</p>
	</footer>
</main>