import { projectService } from '$lib/services';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const slug = params.slug;

	try {
		const project = await projectService.getProject(slug);

		return {
			meta: project.meta,
			content: project.content,
			title: project.meta.title,
		};
	} catch (err) {
		console.error(err);
		error(404, `Project ${slug} not found.`);
	}
}
