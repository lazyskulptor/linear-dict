import { redirect } from '@sveltejs/kit';
import { DEFAULT_LANG_SLUG } from '$lib/config/languages.js';

export function load() {
	redirect(307, `/${DEFAULT_LANG_SLUG}`);
}
