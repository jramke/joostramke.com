import type { Gallery, Project } from "./types";
import { dev } from '$app/environment';

export async function getGallery() {
	let gallery: Gallery[] = [];

	const paths = import.meta.glob('/src/gallery/*.md', { eager: true });
	
	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');
		if (file && typeof file  === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Gallery, 'slug'>;
			const image = { ...metadata, slug } satisfies Gallery;
			gallery.push(image);
		}
	}

	gallery = gallery.sort((first, second) => {
		return +first.slug - +second.slug;
	});
	
	return gallery;
}

export async function getProjects() {
	let projects: Project[] = [];

	const paths = import.meta.glob('/src/projects/**/index.md', { eager: true });
	
	for (const path in paths) {
		const file = paths[path];
		const { slug } = path.match(/\/src\/projects\/(?<slug>.*)\/index.md/)?.groups ?? {};

		if (file && typeof file  === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Project, 'slug'>;
			const project = { ...metadata, slug } satisfies Project;
			if (project?.hidden && !dev) {
				continue;
			}
			projects.push(project);
		}
	}

	projects = projects.sort((first, second) => {
		return new Date(second.date).getTime() - new Date(first.date).getTime();
	});

	let highlights: Project[] = [];
	let archived: Project[] = [];
	let latest: Project[] = [];

	projects.forEach((project) => {
		if (project.highlight) {
			highlights.push(project);
		}

		if (project.archived) {
			archived.push(project);
		} else {
			latest.push(project);
		}
	});
	
	

	return {
		highlights,
		archived,
		latest
	};
}

