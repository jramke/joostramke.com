import type { Action } from 'svelte/action';
import type { MotionSwiperOptions } from './types';

import MotionSwiper from './motion-swiper';

export const motionSwiper: Action<HTMLElement, MotionSwiperOptions | undefined> = (node, options: MotionSwiperOptions = {}) => {
	let swiper: MotionSwiper;

	const initializeSwiper = () => {
		swiper?.kill();
		swiper = new MotionSwiper(node, options);
	};

	initializeSwiper();

	return {
		update(newOptions?: MotionSwiperOptions) {
			options = { ...options, ...newOptions };
			initializeSwiper();
		},
		destroy() {
			swiper?.kill();
		},
	};
};
