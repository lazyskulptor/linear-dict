export const DEFAULT_LANG_SLUG = 'english';
export const SITE_URL = 'https://linear.sooda.life';

/** @type {Array<{slug: string, value: string, label: string, iso: string, dir: 'ltr'|'rtl', seo: {title: string, description: string, keywords: string}, placeholder: string, promptGuidance: string, posLabels: string}>} */
export const languages = [
	{
		slug: 'english',
		value: 'English',
		label: 'English (English)',
		iso: 'en',
		dir: 'ltr',
		seo: {
			title: 'English Interlinear Translation - Linear Dict',
			description: 'Free word-by-word interlinear translation for English text. Analyze every word with contextual meaning, dictionary definitions, and part of speech.',
			keywords: 'english interlinear translation, english word-by-word, english dictionary analysis'
		},
		placeholder: 'Enter English text to analyze...',
		promptGuidance: `The source language is English. Pay attention to:
- Articles (a, an, the) — always include them as separate tokens
- Prepositions (in, on, at, of, to, for, with, by, from, about) — always include as separate tokens
- Contractions (don't, can't, I'm, it's, they're, we've) — treat each contraction as ONE token, do NOT split
- Phrasal verbs (look up, give in, turn off) — each word is a SEPARATE token
- Compound words with hyphens (well-known, mother-in-law) — treat as ONE token
- Possessive 's (John's, the cat's) — include the 's as part of the word token`,
		posLabels: 'noun,verb,adj,adv,prep,det,pron,conj,intj,part'
	},
	{
		slug: 'chinese',
		value: '中文',
		label: '中文 (Chinese)',
		iso: 'zh',
		dir: 'ltr',
		seo: {
			title: '中文逐词翻译 - Linear Dict',
			description: '免费的中文逐词行间翻译工具。对每个词进行语境翻译、词典释义和词性分析。支持10种语言互译。',
			keywords: 'chinese interlinear translation, 中文逐词翻译, 中文词典分析, 行间翻译工具'
		},
		placeholder: '请输入中文文本进行分析...',
		promptGuidance: `The source language is Chinese (中文). This is a character-based language with NO spaces between words. Pay attention to:
- Word segmentation: Chinese text has no spaces. You must segment into meaningful words/phrases, NOT individual characters (unless a single character IS the word). Example: 中华人民共和国 → 中华 / 人民 / 共和国
- Measure words/classifiers (量词): 个, 只, 条, 把, 本 etc. — include as separate tokens
- Particles: 的, 了, 过, 着, 吗, 呢, 吧, 啊 — always include as separate tokens
- Compound words: keep natural compound words together (电脑, 飞机, 学生)
- Chengyu (四字成语) and idiomatic expressions: treat as a single token
- Punctuation: Chinese uses full-width punctuation (，。！？) — include as separate tokens`,
		posLabels: '名词,动词,形容词,副词,介词,冠词,代词,连词,叹词,助词'
	},
	{
		slug: 'japanese',
		value: '日本語',
		label: '日本語 (Japanese)',
		iso: 'ja',
		dir: 'ltr',
		seo: {
			title: '日本語逐語翻訳 - Linear Dict',
			description: '無料の日本語逐語行間翻訳ツール。すべての単語を文脈に沿った翻訳、辞書的定義、品詞タグで分析します。10言語対応。',
			keywords: 'japanese interlinear translation, 日本語逐語翻訳, 日本語辞書分析, 行間翻訳ツール'
		},
		placeholder: '日本語のテキストを入力してください...',
		promptGuidance: `The source language is Japanese (日本語). It uses a mixed writing system with no spaces. Pay attention to:
- Word segmentation: Japanese text has no spaces. Segment into natural grammatical units.
- Kanji compounds (熟語): keep compound kanji words together (学生, 東京, 経済)
- Particles (助詞): は, が, を, に, で, と, も, の, へ, から, まで, より — always separate as individual tokens
- Verb conjugations: include the conjugated form as ONE token (食べました = one token)
- い-adjectives and な-adjectives: include the full adjective form as one token
- Katakana words (外来語): keep as single tokens (コンピューター, テレビ)
- Hiragana grammatical endings attached to kanji: the kanji+okurigana is ONE token (食べる, 美しい)
- Honorific prefixes: お/ご attached to words (お茶, ご飯) — treat as one token
- Sentence-ending particles (ね, よ, な, か) — separate as individual tokens`,
		posLabels: '名詞,動詞,形容詞,副詞,前置詞,冠詞,代名詞,接続詞,感嘆詞,助詞'
	},
	{
		slug: 'korean',
		value: '한국어',
		label: '한국어 (Korean)',
		iso: 'ko',
		dir: 'ltr',
		seo: {
			title: '한국어 축어 번역 - Linear Dict',
			description: '무료 한국어 단어별 행간 번역 도구. 모든 단어를 문맥에 맞는 번역, 사전 정의, 품사 태그로 분석합니다. 10개 언어 지원.',
			keywords: '한국어 축어 번역, 한국어 행간 번역, 단어별 번역, korean interlinear translation'
		},
		placeholder: '한국어 텍스트를 입력하세요...',
		promptGuidance: `The source language is Korean (한국어). It is an agglutinative language where particles attach directly to words. Pay attention to:
- Particles/postpositions (조사): 은/는, 이/가, 을/를, 에, 에서, 의, 로/으로, 과/와, 도 — these attach to nouns but should be SEPARATED as individual tokens. Example: 나는 → 나 + 는 (two tokens), 학교에서 → 학교 + 에서 (two tokens)
- Verb/adjective endings (어미): conjugation endings are part of the verb token. 먹었습니다 = ONE token
- Honorific markers: -시-/-으시- within verbs — keep as part of the verb token
- Compound particles: 에서는, 으로부터 — treat as single particle tokens
- Spaces in Korean: Korean DOES use spaces between word groups (어절). Respect these space boundaries
- Counter words (단위명사): 개, 명, 마리 — separate tokens`,
		posLabels: '명사,동사,형용사,부사,전치사,관사,대명사,접속사,감탄사,조사'
	},
	{
		slug: 'spanish',
		value: 'Español',
		label: 'Español (Spanish)',
		iso: 'es',
		dir: 'ltr',
		seo: {
			title: 'Traducción interlineal del español - Linear Dict',
			description: 'Herramienta gratuita de traducción interlineal palabra por palabra para textos en español. Analiza cada palabra con traducción contextual, definición de diccionario y categoría gramatical.',
			keywords: 'traducción interlineal español, traducción palabra por palabra, análisis de texto español, spanish interlinear translation'
		},
		placeholder: 'Ingrese texto en español para analizar...',
		promptGuidance: `The source language is Spanish (Español). Pay attention to:
- Articles (el, la, los, las, un, una, unos, unas) — always include as separate tokens
- Prepositions (de, en, a, por, para, con, sin, sobre, entre) — always include as separate tokens
- Contractions: "al" (a + el), "del" (de + el) — treat each as ONE token, do NOT split
- Reflexive/clitic pronouns attached to verbs: when written as one word (levántate, dígame, haciéndolo), treat as ONE token
- Standalone clitic pronouns (me, te, le, lo, la, nos, se) — separate tokens
- Inverted punctuation (¿ ¡) — include as separate tokens
- Verb conjugations: the conjugated form is ONE token`,
		posLabels: 'sust,verbo,adj,adv,prep,art,pron,conj,interj,part'
	},
	{
		slug: 'french',
		value: 'Français',
		label: 'Français (French)',
		iso: 'fr',
		dir: 'ltr',
		seo: {
			title: 'Traduction interlinéaire du français - Linear Dict',
			description: 'Outil gratuit de traduction interlinéaire mot à mot pour les textes français. Analysez chaque mot avec traduction contextuelle, définition et catégorie grammaticale.',
			keywords: 'traduction interlinéaire français, traduction mot à mot, analyse de texte français, french interlinear translation'
		},
		placeholder: 'Entrez du texte en français à analyser...',
		promptGuidance: `The source language is French (Français). Pay attention to:
- Articles (le, la, les, un, une, des, du, au, aux) — always include as separate tokens
- Elision: l', d', j', n', s', c', qu' — the elided form with apostrophe is ONE token, the following word is another. Example: l'homme → l' + homme (two tokens)
- Prepositions (de, à, en, dans, sur, sous, par, pour, avec, sans) — always separate tokens
- Compound tenses: auxiliary + participle are SEPARATE tokens (j'ai mangé = j' + ai + mangé)
- Hyphenated inversions (est-ce, dit-il, peut-être) — treat as ONE token
- Reflexive pronouns (me, te, se, nous, vous) — separate tokens when standalone
- Ne...pas negation: ne and pas are each separate tokens`,
		posLabels: 'nom,verbe,adj,adv,prép,art,pron,conj,interj,part'
	},
	{
		slug: 'german',
		value: 'Deutsch',
		label: 'Deutsch (German)',
		iso: 'de',
		dir: 'ltr',
		seo: {
			title: 'Deutsche Interlinearübersetzung - Linear Dict',
			description: 'Kostenloses Wort-für-Wort Interlinearübersetzungstool für deutsche Texte. Analysieren Sie jedes Wort mit kontextueller Übersetzung, Wörterbuchdefinition und Wortart.',
			keywords: 'deutsche Interlinearübersetzung, Wort-für-Wort Übersetzung, Textanalyse Deutsch, german interlinear translation'
		},
		placeholder: 'Geben Sie deutschen Text zur Analyse ein...',
		promptGuidance: `The source language is German (Deutsch). Pay attention to:
- Compound nouns (Zusammensetzung): German creates very long compound words. Treat the entire compound as ONE token (Handschuh, Krankenhaus, Bundesverfassungsgericht). Do NOT split compounds.
- Articles (der, die, das, ein, eine, dem, den, des, einem, einer, eines) — always separate tokens
- Separable verb prefixes: when separated (Ich komme an), "komme" and "an" are separate tokens. When together (ankommen), ONE token.
- Prepositions (in, an, auf, über, unter, neben, zwischen, mit, von, zu, bei, nach, für) — separate tokens
- Modal particles (doch, mal, ja, schon, halt, eben, wohl) — separate tokens
- Umlauts (ä, ö, ü) and ß: preserve exactly as written`,
		posLabels: 'Subst,Verb,Adj,Adv,Präp,Art,Pron,Konj,Interj,Part'
	},
	{
		slug: 'russian',
		value: 'Русский',
		label: 'Русский (Russian)',
		iso: 'ru',
		dir: 'ltr',
		seo: {
			title: 'Подстрочный перевод русского языка - Linear Dict',
			description: 'Бесплатный инструмент пословного подстрочного перевода русских текстов. Анализ каждого слова с контекстным переводом, словарным определением и частью речи.',
			keywords: 'подстрочный перевод русский, пословный перевод, анализ русского текста, russian interlinear translation'
		},
		placeholder: 'Введите русский текст для анализа...',
		promptGuidance: `The source language is Russian (Русский). Pay attention to:
- Cyrillic script: preserve all characters exactly including ё (yo)
- Prepositions (в, на, из, от, к, с, по, за, о, у, до, без, для, через) — always separate tokens. Note: в and с are single-letter prepositions, do NOT skip them
- Verb aspects (совершенный/несовершенный вид): treat the conjugated verb form as ONE token
- Reflexive verbs ending in -ся/-сь (мыться, смеяться) — ONE token, do NOT separate -ся
- Particles (бы, ли, же, не, ни) — separate tokens
- Conjunctions (и, а, но, или, что, чтобы, если, когда) — separate tokens`,
		posLabels: 'сущ,гл,прил,нар,предл,арт,мест,союз,межд,част'
	},
	{
		slug: 'biblical-hebrew',
		value: 'עברית מקראית',
		label: 'עברית מקראית (Biblical Hebrew)',
		iso: 'hbo',
		dir: 'rtl',
		seo: {
			title: 'תרגום בין-שורתי לעברית מקראית - Linear Dict',
			description: 'כלי חינמי לתרגום מילה-במילה של טקסטים בעברית מקראית. ניתוח כל מילה עם תרגום הקשרי, הגדרה מילונית, בניינים וחלקי דיבור. Free Biblical Hebrew interlinear translation with binyanim analysis.',
			keywords: 'תרגום בין-שורתי עברית מקראית, biblical hebrew interlinear, hebrew word-by-word, bible interlinear translation'
		},
		placeholder: 'הכניסו טקסט בעברית מקראית לניתוח...',
		promptGuidance: `The source language is Biblical Hebrew (עברית מקראית). This is a RIGHT-TO-LEFT Semitic language. Pay attention to:
- Right-to-left text: preserve the original character order exactly
- Prefixed prepositions/conjunctions: בְּ (in), לְ (to), כְּ (like), מִ (from), וְ (and), שֶׁ (that/which) are prefixed directly to words. Treat the ENTIRE prefixed word as ONE token (e.g., בְּרֵאשִׁית = one token meaning "in the beginning")
- The definite article הַ (ha) is prefixed to nouns — treat as part of the word token
- Construct chains (סמיכות): each word in the chain is a SEPARATE token, but note the construct state in the meaning
- Verb stems (בניינים): Qal, Niphal, Piel, Pual, Hiphil, Hophal, Hitpael — identify in the dict field
- Vowel pointing (ניקוד): preserve all vowel marks (diacritics) exactly as written
- Maqqef (־): words connected by maqqef should be treated as separate tokens
- Pronominal suffixes: when suffixed to verbs/nouns/prepositions, treat the whole word as ONE token
- Waw-consecutive (וַיֹּאמֶר ,ויהי): treat the entire form as ONE token`,
		posLabels: 'שֵׁם,פֹּעַל,שֵׁם תֹּאַר,תֹּאַר הַפֹּעַל,מִלַּת יַחַס,כִּנּוּי,מִלַּת חִבּוּר,מִלַּת קְרִיאָה,מִלַּת רִבּוּי,חָרוּז'
	},
	{
		slug: 'biblical-greek',
		value: 'Ἑλληνικὴ Κοινή',
		label: 'Ἑλληνικὴ Κοινή (Biblical Greek)',
		iso: 'grc',
		dir: 'ltr',
		seo: {
			title: 'Ἑλληνικὴ Κοινή Interlinear Translation - Linear Dict',
			description: 'Δωρεὰν ἐργαλεῖον μεταφράσεως λέξιν πρὸς λέξιν τῆς Κοινῆς Ἑλληνικῆς. Free Biblical/Koine Greek interlinear translation with tense, aspect, and case analysis.',
			keywords: 'biblical greek interlinear, koine greek translation, Ἑλληνικὴ Κοινή, greek interlinear bible, new testament greek'
		},
		placeholder: 'Εἰσαγάγετε κείμενον Ἑλληνικὸν πρὸς ἀνάλυσιν...',
		promptGuidance: `The source language is Biblical/Koine Greek (Ἑλληνικὴ Κοινή). Pay attention to:
- Greek alphabet with diacritics: preserve all breathing marks (smooth ᾿, rough ῾), accents (acute ´, grave \`, circumflex ῀), and iota subscripts (ᾳ, ῃ, ῳ) exactly
- Definite article (ὁ, ἡ, τό and all declined forms: τοῦ, τῇ, τόν, etc.) — always separate tokens
- Verb tenses/aspects: present, aorist, imperfect, perfect, pluperfect, future — translate the conjugated form as ONE token. Note the tense/aspect in the dict field
- Participles: treat as ONE token, note whether it functions as adjective/noun/adverb
- Particles (μέν, δέ, γάρ, οὖν, ἄν, ἄρα, γε, τε) — always separate tokens
- Enclitics (μου, σου, τις, ἐστίν, etc.): treat as separate tokens
- Prepositions (ἐν, εἰς, ἐκ/ἐξ, ἀπό, πρός, διά, κατά, μετά, παρά, περί, ὑπό, ὑπέρ, ἐπί, σύν) — always separate tokens
- Crasis (e.g., κἀγώ = καὶ ἐγώ): treat the crasis form as ONE token but explain in dict`,
		posLabels: 'ὄνομα,ῥῆμα,ἐπίθετον,ἐπίρρημα,πρόθεσις,ἄρθρον,ἀντωνυμία,σύνδεσμος,ἐπιφώνημα,μόριον'
	}
];

/** @type {Record<string, typeof languages[0]>} */
export const languagesBySlug = Object.fromEntries(languages.map((l) => [l.slug, l]));

/** @type {Record<string, typeof languages[0]>} */
export const languagesByValue = Object.fromEntries(languages.map((l) => [l.value, l]));

/** @param {string} slug */
export function getLanguageBySlug(slug) {
	return languagesBySlug[slug] ?? null;
}
