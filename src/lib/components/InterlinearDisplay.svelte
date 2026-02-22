<script>
	/** @type {{ words: Array<{ word: string, reading: string, meaning: string, dict: string, pos: string }> }} */
	let { words } = $props();

	// Map POS labels from all target languages to color classes
	// Groups: noun, verb, adjective, adverb, preposition, determiner, pronoun, conjunction, interjection, particle
	const posColorGroups = [
		{ keys: ['명사', 'noun', '名词', '名詞', 'сущ', 'sust', 'nom', 'Subst'], cls: 'bg-blue-100 text-blue-700' },
		{ keys: ['동사', 'verb', '动词', '動詞', 'гл', 'verbo', 'verbe', 'Verb'], cls: 'bg-red-100 text-red-700' },
		{ keys: ['형용사', 'adj', '形容词', '形容詞', 'прил', 'Adj'], cls: 'bg-green-100 text-green-700' },
		{ keys: ['부사', 'adv', '副词', '副詞', 'нар', 'Adv'], cls: 'bg-yellow-100 text-yellow-700' },
		{ keys: ['전치사', 'prep', '介词', '前置詞', 'предл', 'prép', 'Präp'], cls: 'bg-purple-100 text-purple-700' },
		{ keys: ['관사', 'det', '冠词', '冠詞', 'арт', 'art', 'Art'], cls: 'bg-gray-100 text-gray-600' },
		{ keys: ['대명사', 'pron', '代词', '代名詞', 'мест', 'Pron'], cls: 'bg-indigo-100 text-indigo-700' },
		{ keys: ['접속사', 'conj', '连词', '接続詞', 'союз', 'Konj'], cls: 'bg-orange-100 text-orange-700' },
		{ keys: ['감탄사', 'intj', '叹词', '感嘆詞', 'межд', 'interj', 'Interj'], cls: 'bg-pink-100 text-pink-700' },
		{ keys: ['조사', 'part', '助词', '助詞', 'част', 'Part'], cls: 'bg-teal-100 text-teal-700' }
	];

	/** @type {Record<string, string>} */
	const posColors = {};
	for (const group of posColorGroups) {
		for (const key of group.keys) {
			posColors[key] = group.cls;
			posColors[key.toLowerCase()] = group.cls;
		}
	}

	function getPosClass(pos) {
		if (!pos) return 'bg-gray-100 text-gray-600';
		return posColors[pos] || posColors[pos.toLowerCase()] || 'bg-gray-100 text-gray-600';
	}
</script>

<div class="flex flex-wrap gap-1 py-4">
	{#each words as item}
		<div
			class="group flex flex-col items-center rounded-lg border border-transparent px-3 py-2 transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-sm"
		>
			<span class="text-lg font-bold text-primary-900">{item.word}</span>
			{#if item.reading}
				<span class="mt-0.5 text-xs text-primary-400">{item.reading}</span>
			{/if}
			<span class="mt-1 text-sm font-medium text-primary-700">{item.meaning}</span>
			{#if item.dict}
				<span class="mt-0.5 max-w-32 text-center text-[11px] leading-tight text-primary-400">{item.dict}</span>
			{/if}
			{#if item.pos}
				<span
					class="mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium {getPosClass(item.pos)}"
				>
					{item.pos}
				</span>
			{/if}
		</div>
	{/each}
</div>
