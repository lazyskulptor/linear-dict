import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { languagesByValue } from '$lib/config/languages.js';

const API_URL = 'https://api.together.xyz/v1/chat/completions';
const MODEL = 'Qwen/Qwen3-235B-A22B-Instruct-2507-tput';

const CHUNK_CHAR_LIMIT = 300;

/**
 * Split text into ~1000 char chunks at sentence/paragraph boundaries.
 * @param {string} text
 * @returns {string[]}
 */
function splitIntoChunks(text) {
	if (text.length <= CHUNK_CHAR_LIMIT) return [text];

	const sentences = text.match(/[^.!?。！？\n]+[.!?。！？]*[\s]*/g) || [text];
	const chunks = [];
	let current = '';

	for (const sentence of sentences) {
		if (current.length + sentence.length > CHUNK_CHAR_LIMIT && current) {
			chunks.push(current.trim());
			current = sentence;
		} else {
			current += sentence;
		}
	}
	if (current.trim()) {
		chunks.push(current.trim());
	}
	return chunks;
}

/**
 * Decode JSON-escaped unicode sequences in a regex-extracted string.
 * @param {string} str
 * @returns {string}
 */
function decodeJsonString(str) {
	return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
		String.fromCharCode(parseInt(hex, 16))
	).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

/**
 * Try to fix and parse potentially malformed JSON array string.
 * @param {string} str
 * @returns {Array<{ word: string, meaning: string, dict: string, pos: string }>}
 */
function repairAndParseJSON(str) {
	// First try direct parse
	try {
		return JSON.parse(str);
	} catch {
		// continue to repair
	}

	// Remove trailing commas before } or ]
	let fixed = str.replace(/,\s*([}\]])/g, '$1');

	// Fix missing commas between objects: }{ or }\n{
	fixed = fixed.replace(/\}\s*\{/g, '},{');

	// If truncated mid-object, cut to last complete object
	if (!fixed.trimEnd().endsWith(']')) {
		const lastBrace = fixed.lastIndexOf('}');
		if (lastBrace !== -1) {
			fixed = fixed.substring(0, lastBrace + 1) + ']';
		}
	}

	// Remove trailing comma before ]
	fixed = fixed.replace(/,\s*\]$/, ']');

	try {
		return JSON.parse(fixed);
	} catch {
		// continue
	}

	// Extract individual objects with regex as last resort
	const objects = [];
	const V = `"((?:[^"\\\\]|\\\\.)*)"`;
	const objRegex = new RegExp(
		`\\{\\s*"word"\\s*:\\s*${V}\\s*,\\s*"meaning"\\s*:\\s*${V}\\s*,\\s*"dict"\\s*:\\s*${V}\\s*,\\s*"pos"\\s*:\\s*${V}\\s*\\}`,
		'g'
	);
	let match;
	while ((match = objRegex.exec(str)) !== null) {
		objects.push({
			word: decodeJsonString(match[1]),
			meaning: decodeJsonString(match[2]),
			dict: decodeJsonString(match[3]),
			pos: decodeJsonString(match[4])
		});
	}

	if (objects.length > 0) {
		return objects;
	}

	throw new Error('Failed to parse JSON response');
}

async function analyzeChunk(text, sourceLang, targetLang, attempt = 0) {
	const start = performance.now();
	const sourceLangConfig = languagesByValue[sourceLang];
	const targetLangConfig = languagesByValue[targetLang];
	const posExamples = targetLangConfig?.posLabels || 'noun,verb,adj,adv,prep,det,pron,conj,intj,part';
	const promptGuidance = sourceLangConfig?.promptGuidance || '';

	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.PRIVATE_TOGETHER_API_KEY}`
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{
					role: 'system',
					content: `You are a JSON-only word-by-word translator specializing in ${sourceLang}. Output ONLY a raw JSON array. No markdown. No explanation. No code fences. Start your response with [ and end with ].`
				},
				{
					role: 'user',
					content: `Translate EVERY single word/token from ${sourceLang} to ${targetLang}. Do NOT skip any token.

${promptGuidance}

CRITICAL: The "meaning" and "dict" fields MUST be written ENTIRELY in ${targetLang}. Do NOT use any other language or script. For example, if target is 한국어, write ONLY in Korean (한글), never use Chinese characters (漢字) or other scripts.

For punctuation marks and standalone numbers: include them but set meaning and dict to empty strings "".

Output: JSON array. Each element: {"word":"...","meaning":"...","dict":"...","pos":"..."}
- word: the exact original token as it appears
- meaning: contextual ${targetLang} translation (MUST be in ${targetLang} only). "" for numbers/punctuation.
- dict: brief dictionary definition (MUST be in ${targetLang} only). "" for numbers/punctuation.
- pos: one of [${posExamples}]

Now analyze this text. Include ALL tokens:
${text}

/no_think`
				}
			],
			temperature: 0.05,
			max_tokens: 8192
		})
	});

	if (!response.ok) {
		const errorBody = await response.text();
		console.error('Together API error:', response.status, errorBody);
		throw new Error(`API error (${response.status})`);
	}

	const data = await response.json();
	let content = data.choices?.[0]?.message?.content?.trim();

	if (!content) {
		throw new Error('Empty response from API.');
	}

	// Strip markdown code fences if present
	content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/g, '');

	// Find the JSON array in the response
	const startIdx = content.indexOf('[');
	if (startIdx === -1) {
		console.error('No JSON array found in response:', content);
		throw new Error('Could not parse response.');
	}

	const jsonStr = content.substring(startIdx);

	try {
		const result = repairAndParseJSON(jsonStr);
		console.log(`[analyze] ${text.length} chars → ${result.length} words (${(performance.now() - start).toFixed(0)}ms)`);
		return result;
	} catch (parseErr) {
		// Retry once on parse failure
		if (attempt < 1) {
			console.warn('JSON parse failed, retrying chunk...', parseErr.message);
			return analyzeChunk(text, sourceLang, targetLang, attempt + 1);
		}
		console.error('Failed to parse JSON after retry:', jsonStr.substring(0, 500));
		throw new Error('Could not parse response.');
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { text, sourceLang, targetLang } = await request.json();

	if (!text?.trim()) {
		return json({ error: 'Please enter text to analyze.' }, { status: 400 });
	}

	if (text.length > 20000) {
		return json({ error: 'Text exceeds the 20,000 character limit.' }, { status: 400 });
	}

	if (!env.PRIVATE_TOGETHER_API_KEY) {
    return json({ error: 'API key is not configured.' }, { status: 500 });
  }

	const trimmedText = text.trim();
	const encoder = new TextEncoder();
	const { readable, writable } = new TransformStream();

	(async () => {
		const writer = writable.getWriter();
		let closed = false;

		async function write(data) {
			if (closed) return;
			try {
				await writer.write(encoder.encode(data));
			} catch {
				closed = true;
			}
		}

		try {
			const chunks = splitIntoChunks(trimmedText);

			for (const chunk of chunks) {
				if (closed) break;
				try {
					const words = await analyzeChunk(chunk, sourceLang, targetLang);
					const filtered = words.filter((w) => w.word.trim());
					await write(JSON.stringify({ words: filtered }) + '\n');
				} catch (err) {
					console.error('Analyze chunk error:', err);
					const message =
						err instanceof Error ? err.message : 'An error occurred during analysis.';
					await write(JSON.stringify({ error: message }) + '\n');
				}
			}
		} catch (err) {
			console.error('Stream error:', err);
			const message = err instanceof Error ? err.message : 'An error occurred during analysis.';
			await write(JSON.stringify({ error: message }) + '\n');
		}

		if (!closed) {
			try { await writer.close(); } catch { /* already closed */ }
		}
	})();

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'X-Content-Type-Options': 'nosniff'
		}
	});
}
