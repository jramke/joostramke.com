import type { MotionSwiperOptions } from './types';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { lerp, clamp } from '$lib/utils';

export default class MotionSwiper {
	private swiper: HTMLElement;
	private items: NodeListOf<HTMLElement>;
	private inners: NodeListOf<HTMLElement>;
	private controls: {
		prev: HTMLButtonElement | null;
		next: HTMLButtonElement | null;
	};
	private swiperWidth: number;
	private itemWidth: number;
	private wrapWidth: number;
	private options: MotionSwiperOptions;
	private scrollSpeed: number;
	private oldScrollY: number;
	private scrollY: number;
	private lastTeasedScrollY: number;
	private teasedScrollY: number;
	private y: number;
	private touchStart: number;
	private touchX: number;
	private progress: number;
	private swipedToScrollY: number;
	private pressed: boolean;
	private isDragging: boolean;
	private normalizing: boolean;
	private paused: boolean;
	private lastDirection: string;
	private direction: string;
	private event: {
		pointerdown: (e: PointerEvent) => void;
		pointermove: (e: PointerEvent) => void;
		pointerup: (e: PointerEvent) => void;
		selectstart: (e: Event) => void;
		click: (i: number) => void;
		resize: () => void;
		handlePrev: () => void;
		handleNext: () => void;
		keydown: (e: KeyboardEvent) => void;
		focus: (i: number) => void;
	};
	private maskPath: SVGPathElement | null = null;
	private animations: Record<string, gsap.core.Tween | null> = {
		left: null,
		right: null,
	};
	private scrollTrigger: ScrollTrigger | null = null;

	constructor(el: string | HTMLElement, options: MotionSwiperOptions = {}) {
		this.swiper = typeof el === 'string' ? (document.querySelector(el) as HTMLElement) : el;
		this.items = this.swiper.querySelectorAll('[data-motion-swiper-item]');
		this.inners = this.swiper.querySelectorAll('[data-motion-swiper-inner]');
		this.controls = {
			prev: this.swiper.querySelector('[data-motion-swiper-prev]'),
			next: this.swiper.querySelector('[data-motion-swiper-next]'),
		};
		this.swiperWidth = this.swiper.clientWidth;
		this.itemWidth = this.items[0].clientWidth;
		this.wrapWidth = this.items.length * this.itemWidth;

		this.options = Object.assign(
			{},
			{
				loop: true,
				lerp: 0.12,
				speed: 2.5,
				centered: true,
				teasing: 1,
				normalizingSpeed: 0.5,
				swipeOnClick: true,
			},
			options,
		);

		this.scrollSpeed = 0;
		this.oldScrollY = 0;
		this.scrollY = 0;
		this.lastTeasedScrollY = 0;
		this.teasedScrollY = 0;
		this.y = 0;
		this.touchStart = 0;
		this.touchX = 0;
		this.progress = 0;
		this.swipedToScrollY = 0;
		this.pressed = false;
		this.isDragging = false;
		this.normalizing = false;
		this.paused = false;
		this.lastDirection = '';
		this.direction = '';
		this.event = {
			pointerdown: () => {},
			pointermove: () => {},
			pointerup: () => {},
			selectstart: () => {},
			click: () => {},
			resize: () => {},
			handlePrev: () => {},
			handleNext: () => {},
			keydown: () => {},
			focus: () => {},
		};

		if (this.swiper.hasAttribute('motion-swiper-init')) return;

		if (typeof gsap === 'undefined') {
			console.warn('GSAP is needed for Motion Swiper to work.');
			return;
		}

		this.items.forEach((e, i) => {
			e.style.position = 'absolute';
			e.style.left = '0';
			e.style.top = '0';
		});

		this.maskPath = this.createMaskPath();
		this.animations = this.createMaskAnimations();
		this.bind();
		this.dispose(0);
		this.render();

		if (this.options.teasing) {
			this.scrollTrigger = null;
			this.teasing();
		}

		this.swiper.setAttribute('motion-swiper-init', '');
	}

	private handleTouchStart(e: PointerEvent): void {
		this.touchStart = e.clientX;
		this.pressed = true;
		this.normalizing = false;
	}

	private handleTouchMove(e: PointerEvent): void {
		if (!this.pressed) return;

		this.isDragging = true;
		this.swiper.setAttribute('data-dragging', '');
		this.touchX = e.clientX;
		this.scrollY += (this.touchX - this.touchStart) * this.options.speed!;

		if (!this.options.loop) {
			const end = this.options.centered ? this.wrapWidth - this.swiperWidth + this.swiperWidth - this.itemWidth : this.wrapWidth - this.swiperWidth;

			if (Math.abs(this.scrollY) >= end) {
				this.handleSwipedToEnd(-end);
				return;
			}

			if (this.scrollY >= 0) {
				this.handleSwipedToEnd(0);
				return;
			}
		}

		this.touchStart = this.touchX;
	}

	private handleTouchEnd(): void {
		this.isDragging = false;
		this.pressed = false;
		this.swiper.removeAttribute('data-dragging');
	}

	private handleSwipedToEnd(pos: number): void {
		this.normalizeMask();
		this.scrollY = pos;
		this.touchStart = this.touchX;
	}

	private preventScroll(e: Event): boolean {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	private handlePrev(): void {
		if (this.isDragging) return;
		this.scrollY += this.itemWidth;
	}

	private handleNext(): void {
		if (this.isDragging) return;
		this.scrollY -= this.itemWidth;
	}

	// private handleKeyDown(e: KeyboardEvent): void {
	//     if (this.isDragging) return;
	//     if (e.key === 'ArrowLeft') {
	//         this.handlePrev();
	//     } else if (e.key === 'ArrowRight') {
	//         this.handleNext();
	//     }
	// }

	private bind() {
		this.event.pointerdown = this.handleTouchStart.bind(this);
		this.event.pointermove = this.handleTouchMove.bind(this);
		this.event.pointerup = this.handleTouchEnd.bind(this);
		this.event.handlePrev = this.handlePrev.bind(this);
		this.event.handleNext = this.handleNext.bind(this);
		// this.event.keydown = this.handleKeyDown.bind(this);
		this.event.selectstart = (e: Event) => {
			e.preventDefault();
			return false;
		};

		this.event.click = (i: number) => this.swipeTo(i);
		this.event.focus = (i: number) => {
			if (this.pressed) return;
			this.swipeTo(i);
		};
		this.event.resize = () => {
			this.swiperWidth = this.swiper.clientWidth;
			this.itemWidth = this.items[0].clientWidth;
			this.wrapWidth = this.items.length * this.itemWidth;
		};

		this.swiper.addEventListener('pointerdown', this.event.pointerdown);
		this.swiper.addEventListener('pointermove', this.event.pointermove);
		this.swiper.addEventListener('pointerup', this.event.pointerup);
		this.swiper.addEventListener('selectstart', this.event.selectstart);
		// this.swiper.addEventListener('keydown', this.event.keydown);
		this.items.forEach((e, i) => {
			e.addEventListener('selectstart', this.event.selectstart);
		});

		this.inners.forEach((e, i) => {
			e.addEventListener('focus', () => this.event.focus(i));
		});

		this.controls.prev?.addEventListener('click', this.event.handlePrev);
		this.controls.next?.addEventListener('click', this.event.handleNext);

		if (this.options.swipeOnClick) {
			this.items.forEach((e, i) => {
				e.addEventListener('click', () => this.event.click(i));
			});
		}

		window.addEventListener('resize', this.event.resize);
	}

	private render(): void {
		if (this.paused) return;
		requestAnimationFrame(() => this.render());

		this.y = lerp(this.y, this.scrollY, this.options.lerp!);
		this.dispose(this.y);

		this.scrollSpeed = clamp(this.y - this.oldScrollY, -100, 100);
		this.scrollSpeed = Math.round((this.scrollSpeed + Number.EPSILON) * 100) / 100;

		this.direction = this.scrollSpeed > 0 ? 'right' : 'left';
		if (this.scrollSpeed === 0 && this.lastDirection.length > 0) this.direction = this.lastDirection;

		this.progress = Math.abs(this.scrollSpeed) / 100;
		this.progress = Math.round((this.progress + Number.EPSILON) * 100) / 100;

		if (this.normalizing) {
			this.progress = lerp(this.progress, 0, this.options.lerp!);
			this.scrollSpeed = lerp(this.scrollSpeed, 0, this.options.lerp!);
		}

		if (this.pressed) {
			window.addEventListener('wheel', this.preventScroll.bind(this));
		} else {
			window.removeEventListener('wheel', this.preventScroll.bind(this));
		}

		gsap.to(this.animations[this.direction], { progress: this.progress });

		if (!this.isDragging) {
			this.normalizeMask();
		}

		gsap.to(this.items, {
			scale: 1 - Math.min(100, Math.abs(this.scrollSpeed)) * (this.options.lerp! * 0.02),
		});

		this.oldScrollY = this.y;
		this.lastDirection = this.direction;
	}

	private createMaskPath() {
		let maskpath = document.querySelector('#motion-swiper__mask path') as SVGPathElement;
		for (const slide of this.inners) {
			slide.style.cssText += '-webkit-clip-path: url(#motion-swiper__mask);clip-path: url(#motion-swiper__mask);';
		}
		if (maskpath) return maskpath;

		document.body.insertAdjacentHTML(
			'beforeend',
			`
            <svg height="0" width="0" style="position:absolute;">
                <!--   https://yqnn.github.io/svg-path-editor/ -->
                <defs>
                    <clipPath id="motion-swiper__mask" clipPathUnits="objectBoundingBox">
                    <path 
                        d="M 1 0 C 1 0.25 1 0.75 1 1 L 0 1 C 0 0.75 0 0.25 0 0 Z"
                        data-path-normal="M 1 0 C 1 0.25 1 0.75 1 1 L 0 1 C 0 0.75 0 0.25 0 0 Z"
                        data-path-left="M 1 0 C 0.85 0.25 0.85 0.75 1 1 L 0.15 1 C -0.05 0.75 -0.05 0.25 0.15 0 Z"
                        data-path-right="M 0.85 0 C 1.05 0.25 1.05 0.75 0.85 1 L 0 1 C 0.15 0.75 0.15 0.25 0 0 Z"
                    />
                    </clipPath>
                </defs>
            </svg>
            `,
		);
		return document.querySelector('#motion-swiper__mask path') as SVGPathElement;
	}

	private normalizeMask() {
		// if (this.normalizing) return;
		this.normalizing = true;
		gsap.to(this.animations[this.direction], { progress: 0 });
		gsap.to(this.maskPath, {
			duration: this.options.normalizingSpeed,
			attr: {
				d: this.maskPath?.dataset.pathNormal || '',
			},
			onComplete: () => {
				this.normalizing = false;
				this.scrollSpeed = 0;
			},
		});
	}

	private createMaskAnimations() {
		return {
			left: gsap.to(this.maskPath, {
				paused: true,
				attr: { d: this.maskPath?.dataset.pathLeft || '' },
			}),
			right: gsap.to(this.maskPath, {
				paused: true,
				attr: { d: this.maskPath?.dataset.pathRight || '' },
			}),
		};
	}

	private dispose(scroll: number) {
		gsap.set(this.items, {
			x: (i) => {
				if (this.options.centered) {
					return i * this.itemWidth + scroll + this.swiperWidth / 2 - this.itemWidth / 2;
				} else {
					return i * this.itemWidth + scroll;
				}
			},
			modifiers: {
				x: (x) => {
					const s = gsap.utils.wrap(-this.itemWidth, this.wrapWidth - this.itemWidth, parseInt(x));
					return this.options.loop ? `${s}px` : x;
				},
			},
		});
	}

	private swipeTo(index: number) {
		if (this.isDragging) return;
		let end = this.options.centered ? this.wrapWidth - this.swiperWidth + this.swiperWidth - this.itemWidth : this.wrapWidth - this.swiperWidth;
		let targetX = this.options.centered ? this.swiperWidth / 2 - this.itemWidth / 2 : 0;
		let targetXbefore = gsap.getProperty(this.items[index], 'x');
		this.swipedToScrollY = Number(targetXbefore) - Number(targetX);
		if (!this.options.loop && Math.abs(this.scrollY - this.swipedToScrollY) >= end) {
			this.scrollY = -end;
			return;
		}
		this.scrollY -= this.swipedToScrollY;
	}

	// TODO: teasing is not working after navigating away and back likely due to ScrollTrigger not being killed properly
	private teasing() {
		if (typeof ScrollTrigger === 'undefined') {
			console.warn('GSAP ScrollTrigger Plugin is needed for the Motion Swiper teasing option.');
			return;
		}
		gsap.registerPlugin(ScrollTrigger);
		let tween: GSAPTween | null = null;
		tween = gsap.to(
			{ teasedScrollY: this.teasedScrollY },
			{
				teasedScrollY: this.itemWidth,
				ease: 'none',
				onUpdate: () => {
					if (tween === null) return;
					const targets = tween.targets() as any;
					this.teasedScrollY = targets[0].teasedScrollY;
					this.scrollY -= this.teasedScrollY - this.lastTeasedScrollY;
					this.lastTeasedScrollY = this.teasedScrollY;
				},
			},
		);
		this.scrollTrigger = ScrollTrigger.create({
			animation: tween,
			trigger: this.swiper,
			scrub: this.options.teasing,
		});
	}

	public start() {
		this.paused = false;
		this.render();
	}

	public stop() {
		this.paused = true;
	}

	public kill() {
		this.paused = true;
		this.swiper.removeEventListener('pointerdown', this.event.pointerdown);
		this.swiper.removeEventListener('pointermove', this.event.pointermove);
		this.swiper.removeEventListener('pointerup', this.event.pointerup);
		this.swiper.removeEventListener('selectstart', this.event.selectstart);
		// this.swiper.removeEventListener('keydown', this.event.keydown);
		this.items.forEach((e, i) => {
			e.removeEventListener('click', () => this.event.click(i));
		});
		this.inners.forEach((e, i) => {
			e.removeEventListener('focus', () => this.event.focus(i));
		});
		this.controls.prev?.removeEventListener('click', this.event.handlePrev);
		this.controls.next?.removeEventListener('click', this.event.handleNext);
		window.removeEventListener('resize', this.event.resize);
		this.scrollTrigger?.kill();
		this.swiper.remove();
		this.maskPath?.closest('svg')?.remove();
	}
}
