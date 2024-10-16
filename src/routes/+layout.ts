export const prerender = true;

import { projectService } from '$lib/services';

export async function load({ url }) {
    const projects = await projectService.getProjects();
    
    return {
        projects: projects,
        pathname: url.pathname
    };
}