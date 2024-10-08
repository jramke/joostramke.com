import type { PageLoad } from './$types';
import { getGallery } from '$lib/api';

export const load = (async () => {
    const gallery = await getGallery();

    return { 
        gallery,
        title: 'Gallery'
    };
}) satisfies PageLoad;