/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: await loadAdapter(),
	}
};

async function loadAdapter() {
	const target = process.env.ADAPTER || 'node'; // default to 'node'

	switch (target) {
		case 'node':
			return (await import('@sveltejs/adapter-node')).default();
		default:
			return (await import('svelte-kit-sst')).default(); // or your SST adapter
	}
}

export default config;
