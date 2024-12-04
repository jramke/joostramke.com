import type { Action } from 'svelte/action';
import type { HoverImageOptions } from './types';

import HoverImage from './hover-image';

export const hoverImage: Action<HTMLElement, HoverImageOptions | undefined> = (node, options: HoverImageOptions = {}) => {
	let hoverImage: HoverImage;

	const initializeHoverImage = () => {
		if (hoverImage) {
			hoverImage.kill();
		}
		hoverImage = new HoverImage(node, options);
	};

	initializeHoverImage();

	return {
		update(newOptions?: HoverImageOptions) {
			options = { ...options, ...newOptions };
			initializeHoverImage();
		},
		destroy() {
			hoverImage?.kill();
		},
	};
};
