export const prerender = true;

import { getProjects } from '$lib/api';

export async function load({ url }) {
    const projects = await getProjects();
    
    return {
        projects: projects,
        pathname: url.pathname
    };
}