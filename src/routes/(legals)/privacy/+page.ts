import type { PageLoad } from './$types';

export const load = (async () => {
    return { title: 'Privacy Policy' };
}) satisfies PageLoad;