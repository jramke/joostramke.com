import type { PageLoad } from './$types';
import { galleryService } from '$lib/services';

export const load = (async () => {
    const gallery = await galleryService.getGallery();

    return { 
        gallery,
        title: 'Gallery'
    };
}) satisfies PageLoad;