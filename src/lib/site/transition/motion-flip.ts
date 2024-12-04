import { clamp, lerp } from '$lib/utils';
import gsap from 'gsap';
// motion image for usage when flipping outside of eg. photogrid, motionswiper or hoverimage

export class MotionFlip {
	private element: HTMLElement;
	private startBounds: DOMRect;
	private targetBounds: DOMRect;
	private buffer: number;
	private base: number;
	private duration: number;
	private points: {
		left: { top: number; bottom: number };
		bottom: { left: number; right: number };
		right: { bottom: number; top: number };
		top: { right: number; left: number };
	};
	private maskPath: string;
	private mask: SVGPathElement;
	private left: number;
	private bottom: number;
	private right: number;
	private top: number;
	private motionSides: number[];

	constructor(element: HTMLElement, targetState: Flip.FlipState, duration: number, flipCallback: () => void) {
		this.element = element;
		this.startBounds = element.getBoundingClientRect();
		this.targetBounds = targetState.elementStates[0].bounds;

		this.buffer = 1;
		this.base = 0;
		this.duration = duration;

		this.points = this.getPoints();
		this.maskPath = this.getMaskPath();
		this.mask = this.createMask();

		this.left = (100 / this.buffer) * clamp(this.targetBounds.left - this.startBounds.left, -this.buffer, this.buffer);
		this.bottom = (100 / this.buffer) * clamp(this.targetBounds.bottom - this.startBounds.bottom, -this.buffer, this.buffer);
		this.right = (100 / this.buffer) * clamp(this.targetBounds.right - this.startBounds.right, -this.buffer, this.buffer);
		this.top = (100 / this.buffer) * clamp(this.targetBounds.top - this.startBounds.top, -this.buffer, this.buffer);

		this.motionSides = [this.left, this.bottom, this.right, this.top];

		this.setPointsManually(0.08, ...this.motionSides);
		setTimeout(() => {
			this.setPointsManually(0, 0, 0, 0, 0, 0);
		}, 100);

		setTimeout(
			() => {
				// kill
				// this.points = null;
				// this.maskPath = null;
				this.mask.closest('svg')?.remove();
				// this.mask = null;
				// this.element = null;
				// this.startBounds = null;
				// this.targetBounds = null;
			},
			this.duration * 1000 + 100,
		);

		flipCallback();
	}
	setPointsManually(base: number, ...sides: number[]) {
		const [left, bottom, right, top] = sides;
		this.base = base;
		this.points = this.getPoints(left, bottom, right, top);
		this.animateMask();
	}
	getPoints(left = 0, bottom = 0, right = 0, top = 0) {
		return {
			left: {
				top: this.base + (this.base / 100) * left,
				bottom: this.base + (this.base / 100) * left,
			},
			bottom: {
				left: 1 - this.base + (this.base / 100) * bottom,
				right: 1 - this.base + (this.base / 100) * bottom,
			},
			right: {
				bottom: 1 - this.base + (this.base / 100) * right,
				top: 1 - this.base + (this.base / 100) * right,
			},
			top: {
				right: this.base + (this.base / 100) * top,
				left: this.base + (this.base / 100) * top,
			},
		};
	}
	animateMask() {
		this.maskPath = this.getMaskPath();
		gsap.to(this.mask, {
			attr: { d: this.maskPath },
		});
	}
	getMaskPath() {
		return `M ${this.base} ${this.base} C ${this.points.left.top} 0.25 ${this.points.left.bottom} 0.75 ${this.base} ${1 - this.base} C 0.25 ${this.points.bottom.left} 0.75 ${this.points.bottom.right} ${1 - this.base} ${1 - this.base} C ${this.points.right.bottom} 0.75 ${this.points.right.top} 0.25 ${1 - this.base} ${this.base} C 0.75 ${this.points.top.right} 0.25 ${this.points.top.left} ${this.base} ${this.base} Z`;
	}
	createMask() {
		let maskpath = document.querySelector('#motion-flip__mask path') as SVGPathElement;
		this.element.style.cssText += '-webkit-clip-path: url(#motion-flip__mask);clip-path: url(#motion-flip__mask);';
		if (maskpath) return maskpath;

		document.body.insertAdjacentHTML(
			'beforeend',
			`
            <svg height="0" width="0" style="position:absolute;">
                <!--   https://yqnn.github.io/svg-path-editor/ -->
                <defs>
                    <clipPath id="motion-flip__mask" clipPathUnits="objectBoundingBox">
                    <path 
                        d="${this.maskPath}"
                        data-path-normal="${this.maskPath}"
                    />
                    </clipPath>
                </defs>
            </svg>
            `,
		);
		return document.querySelector('#motion-flip__mask path') as SVGPathElement;
	}
}
