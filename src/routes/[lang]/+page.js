import { error } from '@sveltejs/kit';
import { getLanguageBySlug, languages } from '$lib/config/languages.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const langConfig = getLanguageBySlug(params.lang);

	if (!langConfig) {
		throw error(404, `Language "${params.lang}" not found`);
	}

	return {
		langConfig,
		allLanguages: languages
	};
}
