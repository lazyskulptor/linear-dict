<script>
	import InterlinearDisplay from '$lib/components/InterlinearDisplay.svelte';

	let text = $state('');
	let sourceLang = $state('English');
	let targetLang = $state('한국어');
	let loading = $state(false);
	let error = $state('');
	/** @type {Array<{ word: string, meaning: string, dict: string, pos: string }> | null} */
	let words = $state(null);
	/** @type {AbortController | null} */
	let abortController = $state(null);

	const languages = [
		{ value: 'English', label: 'English (English)' },
		{ value: '中文', label: '中文 (Chinese)' },
		{ value: '日本語', label: '日本語 (Japanese)' },
		{ value: '한국어', label: '한국어 (Korean)' },
		{ value: 'Español', label: 'Español (Spanish)' },
		{ value: 'Français', label: 'Français (French)' },
		{ value: 'Deutsch', label: 'Deutsch (German)' },
		{ value: 'Русский', label: 'Русский (Russian)' }
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

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'An error occurred during analysis.';
				return;
			}

			words = data.words;
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

<div class="mx-auto max-w-4xl px-4 py-8">
	<header class="mb-8 text-center">
		<h1 class="text-3xl font-bold text-primary-900">Linear Dict</h1>
		<p class="mt-2 text-sm text-primary-500">Word-by-word Interlinear Analysis</p>
	</header>

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

		<textarea
			bind:value={text}
			onkeydown={handleKeydown}
			placeholder="Enter text to analyze..."
			rows="4"
			class="w-full resize-none rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-primary-900 placeholder:text-primary-300 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
		></textarea>

		<div class="mt-3 flex items-center justify-between">
			<span class="text-xs text-primary-400">
				{#if loading}
					Press Esc to stop
				{:else}
					Ctrl+Enter (Cmd+Enter) to analyze
				{/if}
			</span>
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
</div>
