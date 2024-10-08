import type { Project } from "$lib/types.js";
import { error, json } from "@sveltejs/kit";

export async function load({ params, parent }) {
    const slug = params.slug;

    try {        
        const project = await import(`../../../projects/${slug}/index.md`);
        project.metadata.slug = slug;

        return {
            current: project.metadata as Project,
            content: project.default,
            title: project.metadata.title,
        };
    } catch (err) {
        error(404, `Project ${slug} not found.`)
    }
};