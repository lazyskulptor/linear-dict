import { languages, SITE_URL } from '$lib/config/languages.js';

export function GET() {
	const urls = languages
		.map(
			(lang) => `
  <url>
    <loc>${SITE_URL}/${lang.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>${lang.slug === 'english' ? '1.0' : '0.8'}</priority>
  </url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
