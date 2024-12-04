import type { Action } from 'svelte/action';

import Photogrid from './photogrid';
import type { PhotogridOptions } from './types';

export const photogrid: Action<HTMLElement, PhotogridOptions | undefined> = (node, options: PhotogridOptions = {}) => {
	let photogrid: Photogrid;

	const initializePhotogrid = () => {
		photogrid?.kill();
		photogrid = new Photogrid(node, options);
	};

	initializePhotogrid();

	return {
		update(newOptions?: PhotogridOptions) {
			options = { ...options, ...newOptions };
			initializePhotogrid();
		},
		destroy() {
			photogrid?.kill();
		},
	};
};
