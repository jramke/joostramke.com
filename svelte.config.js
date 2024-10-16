import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({ extensions: ['.md'] }),
	],
	kit: {
		adapter: adapter(),
		alias: {
			'$assets': './src/assets',
			'$content': './src/content',
		}
	},
	compilerOptions: {
		css: 'injected', // this is needed so we can generate the og image component and pass the body and styles to satori 
	}
};

export default config;
