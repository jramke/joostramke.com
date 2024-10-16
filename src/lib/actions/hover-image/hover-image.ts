import gsap from "gsap";
import type { HoverImageOptions } from "./types";
import { clamp, lerp } from "$lib/utils";
import { mount, unmount } from "svelte";
import Image from "./image.svelte";

export default class HoverImage {
    private el: HTMLElement;
    private options: Required<HoverImageOptions>;
    private img: HTMLDivElement;
	private imgEl: {};
    private imgDimensions: { width: number; height: number; };
    private x: number;
    private y: number;
    private lastX: number;
    private lastY: number;
    private vel: { x: number; y: number; };
    private lerpVel: { x: number; y: number; };
    private base: number;
    private paused: boolean;
    private points: { left: { top: number; bottom: number; }; bottom: { left: number; right: number; }; right: { bottom: number; top: number; }; top: { right: number; left: number; }; };
    private maskPath: string;
    private mask: SVGPathElement;
    private event: {
        mousemove: (e: MouseEvent) => void;
        scrollmove: () => void;
        mouseenter: (e: MouseEvent) => void;
        mouseleave: () => void;
    };
    
	constructor(element: HTMLElement, options: HoverImageOptions) {
		this.options = Object.assign({}, {
			maxVel: 25,
            lerp: 0.1,
			base: 0.08,
			delta: 0.0005,
            useChild: false,
			zIndex: -1,
            attributes: {},
        }, options);
		this.el = this.options.useChild ? element.firstChild as HTMLElement : element;

        this.x = 0;
		this.y = 0;
		this.lastX = 0;
		this.lastY = 0;
		this.vel = { x: 0, y: 0 };
		this.lerpVel = { x: 0, y: 0 };
		this.base = 0;
		this.paused = false;
		this.points = this.getPoints();
		this.maskPath = this.getMaskPath();
		
        this.event = {
            mousemove: () => {},
            scrollmove: () => {},
            mouseenter: () => {},
            mouseleave: () => {},
        };
		
		if (element.hasAttribute('data-hover-img-init')) {
            throw new Error('HoverImage: Already initialized');
        }
		
		const createdImg = this.createHoverImage();
		this.img = createdImg.wrap;
		this.imgEl = createdImg.img;
		this.imgDimensions = this.getDimensions(this.img);
        this.mask = this.createMask();

        element.style.position = 'relative';

		this.init();

		this.render();
		element.setAttribute('data-hover-img-init', '');
	}

	private render() {
		if (this.paused === true) return; 
		requestAnimationFrame(() => this.render());
		this.vel = {
			x: 100 / this.options.maxVel * clamp(this.x - this.lastX, -this.options.maxVel, this.options.maxVel), 
			y: 100 / this.options.maxVel * clamp(this.y - this.lastY, -this.options.maxVel, this.options.maxVel), 
		};
		this.lerpVel = {
			x: lerp(this.lerpVel.x, this.vel.x, this.options.lerp),
			y: lerp(this.lerpVel.y, this.vel.y, this.options.lerp),
		}

		this.base = this.options.base / 100 * (120 / 100 * Math.max(Math.abs(this.lerpVel.x), Math.abs(this.lerpVel.y)));

		this.points = this.getPoints();

		this.maskPath = this.getMaskPath();
		gsap.to(this.mask, {
			attr: { d: this.maskPath}
		});

		const distance = Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2));
		const scale = Math.min(distance * this.options.delta, 1);
		const angle = (this.vel.x * this.options.delta * 180) / Math.PI;
		gsap.to(this.img, {
			rotate: angle,
		})

		this.lastX = this.x;
		this.lastY = this.y;
	}

	private init() {
        this.event.mousemove = (e: MouseEvent) => {
			if (this.paused === true) return;
			this.x = e.clientX;
			this.y = e.clientY;
			this.move();
		}
        this.event.scrollmove = () => {
			if (this.paused === true) return;
			window.dispatchEvent(new MouseEvent('mousemove', { clientX: this.x, clientY: this.y }));
		}
		this.event.mouseenter = (e: MouseEvent) => {
			if (this.paused === true) return;
			this.el.parentElement?.classList.add('hover-image-active');
			this.toggleVisibility(this.img, true);
			this.x = e.clientX;
			this.y = e.clientY;
			this.move();
		}
		this.event.mouseleave = () => {
			if (this.paused === true) return;
			this.el.parentElement?.classList.remove('hover-image-active')
			this.toggleVisibility(this.img, false)
		}

		gsap.matchMedia().add('(hover: none)', () => {
			this.img.classList.add('flip-none');
			return () => {
				this.img.classList.remove('flip-none');
			}
		})

		gsap.matchMedia().add('(hover: hover)', () => {
			window.addEventListener('mousemove', this.event.mousemove);
            window.addEventListener('scroll', this.event.scrollmove);
			this.el.addEventListener('mouseenter', this.event.mouseenter);
			this.el.addEventListener('mouseleave', this.event.mouseleave);
			return () => {
				window.removeEventListener('mousemove', this.event.mousemove);
				this.el.removeEventListener('mouseenter', this.event.mouseenter);
				this.el.removeEventListener('mouseleave', this.event.mouseleave);
			}
		})
	}

	private createHoverImage() {
		let imgWrap = document.createElement('div');
		// We use a svelte component here because we use the enhanced:img to handle all images so the path would break in build 
		let imageElm = mount(Image, { target: imgWrap, props: { src: this.options.image } });
		// let imageElm = new Image();
		// imageElm.src = this.options.imgUrl;
		imgWrap.className = "aspect-[0.9] pointer-events-none outline-none top-0 left-0 w-[250px] fixed [&_img]:object-cover [&_img]:size-full";
        imgWrap.style.transform = 'none !important';
		imgWrap.style.zIndex = this.options.zIndex + '';
		imgWrap.setAttribute('aria-hidden', 'true');
		if (this.options.attributes) {
			for (const [key, value] of Object.entries(this.options.attributes)) {
				imgWrap.setAttribute(key, value);
			}
		}

		// // let the browser rasterize the image and hide it after
		// // cause strange behavior where browser dont really load images with opacity set to 0
		// imageElm.addEventListener('load', () => {
		// 	gsap.set(imageElm, {
		// 		position: 'fixed',
		// 		opacity: 0.001,
		// 		top: 0,
		// 		left: 0,
		// 	})

		// 	document.body.appendChild(imageElm);
		// 	setTimeout(() => {
		// 		gsap.set(imageElm, {clearProps: 'all'});
		// 		imageElm.remove();
		// 		imgWrap.classList.add('absolute');
        //         imgWrap.classList.remove('fixed');
        //         imgWrap.style.transform = '';
		// 		this.toggleVisibility(imgWrap, false, 0);
		// 		imgWrap.appendChild(imageElm);
		// 		this.el.appendChild(imgWrap);
		// 	}, 100);
		// });

		imgWrap.classList.add('absolute');
		imgWrap.classList.remove('fixed');
		imgWrap.style.transform = '';
		this.toggleVisibility(imgWrap, false, 0);
		// imgWrap.appendChild(imageElm);
		this.el.appendChild(imgWrap);

		return { wrap: imgWrap, img: imageElm };
	}

	private move() {
		this.imgDimensions = this.getDimensions(this.img);
		const linkRect = this.el.getBoundingClientRect();
		const y = this.y - linkRect.top - this.imgDimensions.height / 2;
		const x = this.x - linkRect.left - this.imgDimensions.width / 2;

		gsap.to(this.img, {
			y: y,
			x: x,
		});
	}

	private createMask() {
		let maskpath = document.querySelector('#hover-image__mask path') as SVGPathElement;
		this.img.style.cssText +=
			'-webkit-clip-path: url(#hover-image__mask);clip-path: url(#hover-image__mask);';
		if (maskpath) return maskpath;

		document.body.insertAdjacentHTML(
			'beforeend',
			`
            <svg height="0" width="0" style="position:absolute;">
                <!--   https://yqnn.github.io/svg-path-editor/ -->
                <defs>
                    <clipPath id="hover-image__mask" clipPathUnits="objectBoundingBox">
                    <path 
                        d="${this.maskPath}"
                        data-path-normal="${this.maskPath}"
                    />
                    </clipPath>
                </defs>
            </svg>
            `
		);
		return document.querySelector('#hover-image__mask path') as SVGPathElement;
	}
	
	private toggleVisibility(el: gsap.TweenTarget, show: boolean, duration: null|number = null) {
		let time = {};
		if (duration !== null) {
			time = {
				duration: 0,
			};
		}
		gsap.to(el, {
			opacity: show ? 1 : 0,
			duration: 0.15,
			...time,
		});
	}

	private getMaskPath() {
		return `M ${this.base} ${this.base} C ${this.points.left.top} 0.25 ${this.points.left.bottom} 0.75 ${this.base} ${1 - this.base} C 0.25 ${this.points.bottom.left} 0.75 ${this.points.bottom.right} ${1 - this.base} ${1 - this.base} C ${this.points.right.bottom} 0.75 ${this.points.right.top} 0.25 ${1 - this.base} ${this.base} C 0.75 ${this.points.top.right} 0.25 ${this.points.top.left} ${this.base} ${this.base} Z`;
	}

	private getPoints() {
		return {
			left: {
				top: this.base + (this.base / 100 * this.lerpVel.x),
				bottom: this.base + (this.base / 100 * this.lerpVel.x),
			},
			bottom: {
				left: (1 - this.base) + (this.base / 100 * this.lerpVel.y),
				right: (1 - this.base) + (this.base / 100 * this.lerpVel.y),
			},
			right: {
				bottom: (1 - this.base) + (this.base / 100 * this.lerpVel.x),
				top: (1 - this.base) + (this.base / 100 * this.lerpVel.x),
			},
			top: {
				right: this.base + (this.base / 100 * this.lerpVel.y),
				left: this.base + (this.base / 100 * this.lerpVel.y),
			},
		};
	}

	private getDimensions(el: HTMLElement) {
		return {width: el.clientWidth, height: el.clientHeight};
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
		window.removeEventListener('mousemove', this.event.mousemove);
        window.removeEventListener('scroll', this.event.scrollmove);
		unmount(this.imgEl);
		this.el.removeEventListener('mouseenter', this.event.mouseenter);
		this.el.removeEventListener('mouseleave', this.event.mouseleave);
		this.el.remove();
		this.mask.closest('svg')?.remove();
	}
}