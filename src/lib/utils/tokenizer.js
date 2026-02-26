/**
 * Cursor-based sequential mapping of API words to original text.
 * Preserves the original text exactly, mapping API translation results onto it.
 *
 * @param {string} originalText - The user's original input text
 * @param {Array<{word: string, meaning: string, dict: string, pos: string}>} apiWords - API response words
 * @returns {Array<{original: string, meaning?: string, dict?: string, pos?: string, isWhitespace?: boolean, unmatched?: boolean}>}
 */
export function mapWordsToOriginalText(originalText, apiWords) {
	/** @type {Array<{original: string, meaning?: string, dict?: string, pos?: string, isWhitespace?: boolean, unmatched?: boolean}>} */
	const tokens = [];
	let cursor = 0;

	for (const apiWord of apiWords) {
		// 1. Collect whitespace before the next word
		const wsStart = cursor;
		while (cursor < originalText.length && /\s/.test(originalText[cursor])) {
			cursor++;
		}
		if (cursor > wsStart) {
			tokens.push({ original: originalText.slice(wsStart, cursor), isWhitespace: true });
		}

		// 2. Try to find apiWord in original text from cursor position
		const match = findMatch(originalText, cursor, apiWord.word);

		if (match) {
			// 3. Any skipped text before the match becomes unmatched
			if (match.start > cursor) {
				tokens.push({ original: originalText.slice(cursor, match.start), unmatched: true });
			}
			// 4. Matched token with API annotations
			tokens.push({
				original: originalText.slice(match.start, match.end),
				meaning: apiWord.meaning,
				dict: apiWord.dict,
				pos: apiWord.pos
			});
			cursor = match.end;
		} else {
			// No match found — skip this API word (LLM hallucination)
		}
	}

	// Remaining text after all API words processed
	if (cursor < originalText.length) {
		// Split remaining into whitespace and non-whitespace chunks
		const remaining = originalText.slice(cursor);
		const chunks = remaining.match(/(\s+|\S+)/g);
		if (chunks) {
			for (const chunk of chunks) {
				if (/^\s+$/.test(chunk)) {
					tokens.push({ original: chunk, isWhitespace: true });
				} else {
					tokens.push({ original: chunk, unmatched: true });
				}
			}
		}
	}

	return tokens;
}

/**
 * Find apiWord in originalText starting from cursor position.
 * Uses case-insensitive comparison with a search window.
 * Also tries stripped comparison (removing punctuation from edges).
 *
 * @param {string} text - Original text
 * @param {number} cursor - Current position in text
 * @param {string} apiWord - Word from API to find
 * @returns {{start: number, end: number} | null}
 */
function findMatch(text, cursor, apiWord) {
	if (!apiWord) return null;

	const maxWindow = Math.min(text.length, cursor + apiWord.length * 3 + 20);
	const searchRegion = text.slice(cursor, maxWindow);
	const lowerApiWord = apiWord.toLowerCase();

	// Try exact substring match (case-insensitive) in the search window
	const lowerRegion = searchRegion.toLowerCase();
	const idx = lowerRegion.indexOf(lowerApiWord);
	if (idx !== -1) {
		return { start: cursor + idx, end: cursor + idx + apiWord.length };
	}

	// Try stripped comparison: remove leading/trailing punctuation from apiWord
	const stripped = apiWord.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
	if (stripped && stripped !== apiWord) {
		const lowerStripped = stripped.toLowerCase();
		const idx2 = lowerRegion.indexOf(lowerStripped);
		if (idx2 !== -1) {
			// Extend match to include surrounding punctuation in original text
			let start = cursor + idx2;
			let end = cursor + idx2 + stripped.length;
			// Extend backwards to include leading punctuation attached to this word
			while (start > cursor && /[^\s\p{L}\p{N}]/u.test(text[start - 1])) {
				start--;
			}
			// Extend forwards to include trailing punctuation attached to this word
			while (end < text.length && /[^\s\p{L}\p{N}]/u.test(text[end])) {
				end++;
			}
			return { start, end };
		}
	}

	return null;
}
