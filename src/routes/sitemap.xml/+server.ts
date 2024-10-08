import { getProjects } from '$lib/api';

export const prerender = true;

const site = 'https://joostramke.com';
const pages = ['about', 'gallery', 'crafts', 'projects', 'colophon', 'privacy', 'imprint'];

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const projects = (await getProjects()).latest.map((project) => project.slug);

	const body = sitemap(site, pages, projects);

	return new Response(body, {
      headers: {
        'Content-Type': 'application/xml',
      }
  });
}

const sitemap = (site: string, pages: string[], projects: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>

<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>${site}</loc>
    <priority>0.5</priority>
  </url>

  ${pages
	.map(
		(page) => `
  <url>
    <loc>${site}/${page}</loc>
    <priority>0.5</priority>
  </url>
  `
	)
	.join('')}

  ${projects
	.map(
		(post) => `
  <url>
    <loc>${site}/projects/${post}</loc>
    <priority>0.5</priority>
  </url>
  `
	)
	.join('')}
</urlset>`;