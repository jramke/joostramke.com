import type { PhotogridOptions } from "./types";

import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import { getRandomNumber, lerp, clamp } from "$lib/utils";

// TODO: keyboard focus support
export default class Photogrid {
    grid: HTMLElement;
    gridParent: HTMLElement;
    items: NodeListOf<Element>;
    options: Required<PhotogridOptions>;
    itemsRandomStart: { x: number; y: number; }[];
    event: { 
        open: (e: Event) => void, 
        close: () => void, 
        mousemove: (e: MouseEvent) => void
    };
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    base: number;
    vel: { x: number; y: number; };
    lerpVel: { x: number; y: number; };
    paused: boolean;
    pointsManually: boolean;
    transitioning: boolean;
    transitionSides: number[];
    state: any;
    activeItem: any;
    activeParent: any;
    points: { left: { top: number; bottom: number; }; bottom: { left: number; right: number; }; right: { bottom: number; top: number; }; top: { right: number; left: number; }; };
    maskPath: string;
    mask: SVGPathElement[];
    lightbox: HTMLElement;

	constructor(element: HTMLElement, options: PhotogridOptions) {
		this.options = Object.assign({}, {
			maxVel: 20,
            lerp: 0.1,
			base: 0.05,
			move: 0.08,
			delta: 0.0005,
			lightbox: true,
        }, options);
		this.grid = element;
        this.gridParent = this.grid.parentElement as HTMLElement;
		this.items = this.grid.querySelectorAll('[data-photogrid-item]');
		this.itemsRandomStart = this.getItemsRandomStart();

		this.event = {
            open: () => {},
            close: () => {},
            mousemove: () => {},
        };
		this.x = 0;
		this.y = 0;
		this.lastX = 0;
		this.lastY = 0;
		this.base = this.options.base;
		this.vel = { x: 0, y: 0 };
		this.lerpVel = { x: 0, y: 0 };
		this.paused = false;
		this.pointsManually = false;
		this.transitionSides = [0, 0, 0, 0];
		this.transitioning = false;
		this.state = null;
		this.activeItem = null;
		this.activeParent = null;
		this.points = this.getPoints();
		this.maskPath = this.getMaskPath();
		this.mask = this.createMask();
		this.lightbox = document.querySelector('[data-photogrid-lightbox]') as HTMLElement;

        if (element.hasAttribute('photogrid-init')) return;

		this.init();
		this.render();
		element.setAttribute('photogrid-init', '');
		
	}
	render() {
		if (this.paused === true) {
			return;
		}
		requestAnimationFrame(() => this.render());

		this.vel = {
			x: 100 / this.options.maxVel * clamp(this.x - this.lastX, -this.options.maxVel, this.options.maxVel), 
			y: 100 / this.options.maxVel * clamp(this.y - this.lastY, -this.options.maxVel, this.options.maxVel), 
		};
		this.lerpVel = {
			x: lerp(this.lerpVel.x, this.vel.x, this.options.lerp),
			y: lerp(this.lerpVel.y, this.vel.y, this.options.lerp),
		}

		this.points = this.getPoints();

		this.animateMask();

		const distance = Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2));
		const scale = Math.min(distance * this.options.delta, 1);
		const angle = (this.vel.x * this.options.delta * 180) / Math.PI;
		gsap.to(this.items, {
			rotate: angle,
		})

		this.lastX = this.x;
		this.lastY = this.y;
	}
	init() {
		this.grid.classList.remove('opacity-0');
		gsap.set(this.grid, {
			xPercent: -50,
			yPercent: -50,
		});
		gsap.fromTo(this.items, {opacity: 0, scale: 0,}, {opacity: 1, scale: 1, stagger: 0.04, delay: 0.2, ease: 'smooth'})
		this.event.open = (e) => {
			if (this.transitioning === true) return;
			this.stop();
			// window.lenis?.stop();
			this.transitioning = true;
			const target = (e.target as HTMLElement).closest('[data-photogrid-item-inner-wrapper]');
            if (!target) return;

			this.activeItem = target;
			this.activeParent = target?.parentElement;
			gsap.set(this.activeParent, {height: this.activeParent.offsetHeight});
			this.state = Flip.getState(target);
			// document.body.appendChild(this.lightbox);
			this.lightbox.setAttribute('data-open', 'true');
			this.lightbox.appendChild(target);
			// if (this.lightboxButton) this.lightboxButton.href = (target?.firstChild as HTMLElement).dataset?.url || '#';
			
			const startBounds = this.state.elementStates[0].bounds;
			const targetBounds = target.getBoundingClientRect();
			const buffer = 1;
			const left = 100 / buffer * clamp(targetBounds.left - startBounds.left, -buffer, buffer);
			const bottom = 100 / buffer * clamp(targetBounds.bottom - startBounds.bottom, -buffer, buffer);
			const right = 100 / buffer * clamp(targetBounds.right - startBounds.right, -buffer, buffer);
			const top = 100 / buffer * clamp(targetBounds.top - startBounds.top, -buffer, buffer);
			this.transitionSides = [left, bottom, right, top]; // left, bottom, right, top
			setTimeout(() => {
				this.setPointsManually(this.options.move, ...this.transitionSides);
			}, 40);
			setTimeout(() => {
				this.setPointsManually(this.options.base, 0, 0, 0, 0, 0);
			}, 150);
			Flip.from(this.state, {
				ease: 'smooth-in',
				duration: .8,
				onComplete: () => {
					this.transitioning = false;
				},
			})
			// this.lightbox.classList.add('backdrop');
			// gsap.set(this.lightboxThumb, {opacity: 1});
			this.activeItem.addEventListener('click', this.event.close);
			// this.activeItem.setAttribute('data-cursor-text', 'Close');
			// window.cursor?.setText('Close');
		}
		this.event.close = () =>  {
			if (this.transitioning === true) return;
			this.transitioning = true;
			
			this.activeItem.removeEventListener('click', this.event.close);
			// this.activeItem.removeAttribute('data-cursor-text');
			// window.cursor?.removeText();
			this.lightbox.classList.remove('backdrop');
			// gsap.set(this.lightboxThumb, {opacity: 0});
			this.transitionSides.forEach((side, i) =>  {
				let value = side * 0.5;
				this.transitionSides[i] = -value;
			});
			setTimeout(() => {
				this.setPointsManually(this.options.move, ...this.transitionSides);
			}, 40);
			setTimeout(() => {
				this.setPointsManually(this.options.base, 0, 0, 0, 0, 0);
				this.lightbox.setAttribute('data-open', 'false');
			}, 250);
			Flip.to(this.state, {
				targets: this.activeItem,
				ease: 'smooth-in',
				duration: .8,
				onComplete: () => {
					this.activeParent.appendChild(this.activeItem);
					gsap.set(this.activeItem, {clearProps: 'width,height,top,left,max-width,max-height,min-width,min-height,transform,grid-area,position,padding,scale,rotate,translate,transition'});
					gsap.set(this.activeParent, {clearProps: 'height'});
					this.start();
					// window.lenis?.start();
					this.unsetPointsManually();
					this.transitioning = false;
					// this.lightbox.remove();
					this.activeItem = null;
					this.activeParent = null;
				}
			})
		}

        this.event.mousemove = (e) => {
			if (this.paused === true) return;
            
			this.x = (e.clientX - this.gridParent.offsetWidth / 2) / this.gridParent.offsetWidth * -(this.grid.offsetWidth - this.gridParent.offsetWidth);
			this.y = (e.clientY - this.gridParent.offsetHeight / 2) / this.gridParent.offsetHeight * -(this.grid.offsetHeight - this.gridParent.offsetHeight);
			
			gsap.to(this.grid, {
				x: this.x,
				y: this.y,
				xPercent: -50,
				yPercent: -50,
				duration: 1,
			})

			gsap.to(this.items, {
				x: (index) => ((e.clientX - this.gridParent.offsetWidth / 2) / this.gridParent.offsetWidth) * this.itemsRandomStart[index].x,
				y: (index) => ((e.clientY - this.gridParent.offsetHeight / 2) / this.gridParent.offsetHeight) * this.itemsRandomStart[index].y,
			})
		}

		if (this.options.lightbox && this.lightbox) {
			this.items.forEach(e => {
				e.addEventListener('click', this.event.open);
			});
		}

		this.gridParent.addEventListener('mousemove', this.event.mousemove);


	}
	// createLightbox() {
	// 	const lightbox = document.createElement('div');
	// 	lightbox.classList.add('lightbox');
	// 	const thumb = document.createElement('div');
	// 	thumb.classList.add('lightbox__thumb');
	// 	// thumb.addEventListener('mouseenter', () => window.cursor?.removeState('-text'));
	// 	// thumb.addEventListener('mouseleave', () => window.cursor?.addState('-text'));
	// 	lightbox.appendChild(thumb);
	// 	thumb.insertAdjacentHTML(
	// 		'beforeend',
	// 		`
	// 		<a href="https://jstrmk.darkroom.com/" target="_blank" rel="noopener" class="btn btn--white">
	// 			<div class="btn__fill"></div>
	// 			<span data-magnetic-inner data-text="Get as print">
	// 				<span>Get as print</span>
	// 			</span>
	// 		</a>
	// 		`
	// 	);

	// 	this.lightboxButton = thumb.querySelector('.btn');
	// 	this.lightboxThumb = thumb;
	// 	return lightbox;
	// }
	createMask() {
		let masks: SVGPathElement[] = [];
		this.items.forEach((e, index) => {
			this.setMaskStyle(e.querySelector('[data-photogrid-item-inner]') as HTMLElement, index);
			e.insertAdjacentHTML(
				'beforeend',
				`
				<svg height="0" width="0" style="position:absolute;">
					<!--   https://yqnn.github.io/svg-path-editor/ -->
					<defs>
						<clipPath id="photogrid__mask-${index}" clipPathUnits="objectBoundingBox">
							<path 
								d="${this.maskPath}"
								data-path-normal="${this.maskPath}"
							/>
						</clipPath>
					</defs>
				</svg>
				`
			);
			masks.push(e.querySelector(`#photogrid__mask-${index} path`) as SVGPathElement);
		});

		return masks;
	}
	getMaskPath() {
		return `M ${this.base} ${this.base} C ${this.points.left.top} 0.25 ${this.points.left.bottom} 0.75 ${this.base} ${1 - this.base} C 0.25 ${this.points.bottom.left} 0.75 ${this.points.bottom.right} ${1 - this.base} ${1 - this.base} C ${this.points.right.bottom} 0.75 ${this.points.right.top} 0.25 ${1 - this.base} ${this.base} C 0.75 ${this.points.top.right} 0.25 ${this.points.top.left} ${this.base} ${this.base} Z`;
	}
	getPoints(left = this.lerpVel.x, bottom = this.lerpVel.y, right = this.lerpVel.x, top = this.lerpVel.y) {
		return {
			left: {
				top: this.base + (this.base / 100 * left),
				bottom: this.base + (this.base / 100 * left),
			},
			bottom: {
				left: (1 - this.base) + (this.base / 100 * bottom),
				right: (1 - this.base) + (this.base / 100 * bottom),
			},
			right: {
				bottom: (1 - this.base) + (this.base / 100 * right),
				top: (1 - this.base) + (this.base / 100 * right),
			},
			top: {
				right: this.base + (this.base / 100 * top),
				left: this.base + (this.base / 100 * top),
			},
		};
	}
	getItemsRandomStart() {
		const arr = [];
		for (let index = 0; index < this.items.length; index++) {
			const random = {
				x: getRandomNumber(0,150),
				y: getRandomNumber(0,150),
			};
			arr.push(random);
		}
		return arr;
	}
	unsetPointsManually() {
		this.pointsManually = false;
		this.base = this.options.base;
	}
	setPointsManually(base = this.options.base, ...sides: number[]) {
        const [left, bottom, right, top] = sides;
		this.pointsManually = true;
		this.base = base;
		this.points = this.getPoints(left, bottom, right, top);
		this.animateMask();
	}
	setMaskStyle(e: HTMLElement, index: number) {
		e.style.cssText += `
			-webkit-clip-path: url(#photogrid__mask-${index});
			clip-path: url(#photogrid__mask-${index});
		`;
	}
	animateMask() {
		this.maskPath = this.getMaskPath();
		if (this.activeParent) {
			gsap.to(this.activeParent.querySelector('svg path'), {
				attr: { d: this.maskPath},
			});
		} else {
			gsap.to(this.mask, {
				attr: { d: this.maskPath}
			});
		}
	}
	start() {
		this.paused = false;
		this.render();
	}
	stop() {
		this.vel = {x: 0, y: 0};
		this.lerpVel = {x: 0, y: 0};
		gsap.killTweensOf(this.grid);
		gsap.killTweensOf(this.items);
		this.paused = true;
	}
	kill() {
		this.paused = true;
		this.gridParent.removeEventListener('mousemove', this.event.mousemove);
	}
}
