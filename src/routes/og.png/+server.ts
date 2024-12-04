import { render } from 'svelte/server';
import fs from 'fs/promises';
import satori from 'satori';
import { html as toReactNode } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import OgImage from './og-image.svelte';

export const prerender = true;

const width = 1200;
const height = 630;

const extractStyleTagWithContent = (input: string): string | null => {
	const styleTagRegex = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
	const match = styleTagRegex.exec(input);
	return match ? match[0] : null;
};

export async function GET() {
	const Inter = await fs.readFile('./src/routes/og.png/Inter_Regular.ttf');

	const result = render(OgImage);
	const markup = toReactNode(`${result.body}${extractStyleTagWithContent(result.head)}`);
	const svg = await satori(markup, {
		fonts: [
			{
				name: 'Inter',
				data: Inter,
				style: 'normal',
			},
		],
		height: height,
		width: width,
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width,
		},
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png',
		},
	});
}
