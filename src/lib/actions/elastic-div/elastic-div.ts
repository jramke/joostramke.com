import { prefersReducedMotion } from "$lib/utils";
import gsap from "gsap";

export class ElasticDiv {
    private el: HTMLElement;
    private width: number;
    private height: number;
    private points: {
        defaultX: number;
        defaultY: number;
        x: number;
        y: number;
    };
    private stick: boolean;
    private lastMathSign: number | null;
    private pseudoDiv: HTMLElement;
    private path: SVGPathElement;
    private event: {
        mousemove: (e: MouseEvent) => void;
        mouseleave: () => void;
    };
    private resizeObserver: ResizeObserver | null;
    constructor(el: string | HTMLElement) {
        this.el = typeof el === "string" ? document.querySelector(el) as HTMLElement : el;
        this.width = this.el.clientWidth;
        this.height = this.el.clientHeight;
        this.points = {
            defaultX: this.width / 2,
            defaultY: 100,
            x: this.width / 2,
            y: 100,
        };
        this.stick = false;
        this.lastMathSign = null;

        gsap.set(this.el, {
            paddingTop: 100
        })

        this.pseudoDiv = this.createPseudoDiv();
	    this.path = this.createMask();
        this.event = {
            mousemove: () => {},
            mouseleave: () => {},
        };
        this.resizeObserver = null;
        this.bind();
    }

    bind() {
        this.event.mousemove = (e) => {
            this.points.x = e.offsetX;
            this.points.y = e.offsetY;

            const mathSign = Math.sign(e.offsetY - 100);
            if (this.lastMathSign && this.lastMathSign != mathSign) this.stick = true;
            this.lastMathSign = mathSign;

            if (!this.stick) {
                return
            }

            gsap.to(this.path, {
                attr: {
                    d: this.getPath(),
                },
                duration: .1,
            })
        };
        this.event.mouseleave = () => {
            this.points.x = this.points.defaultX;
            this.points.y = this.points.defaultY;
            this.stick = false;
            gsap.to(this.path, {
                attr: {
                    d: this.getPath(),
                },
                ease: 'elastic.out(1, 0.125)',
                duration: 2,
                
            })
        };
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                this.width = entry.target.clientWidth;
                this.height = entry.target.clientHeight;
                this.points.defaultX = this.width / 2;
                gsap.killTweensOf(this.path);
                gsap.set(this.path, {
                    attr: {
                        d: this.getPath(),
                    }
                })
            }
        });

        if (prefersReducedMotion()) return;
        this.pseudoDiv.addEventListener('mousemove', this.event.mousemove);
        this.pseudoDiv.addEventListener('mouseleave', this.event.mouseleave);
        this.resizeObserver.observe(this.el);

    }

    kill() {
        gsap.killTweensOf(this.path);
        this.pseudoDiv.removeEventListener('mousemove', this.event.mousemove);
        this.pseudoDiv.removeEventListener('mouseleave', this.event.mouseleave);
        this.resizeObserver?.unobserve(this.el);
    }

    createMask() {
        let maskpath = document.querySelector('#elastic-div__mask path') as SVGPathElement;
		this.el.style.cssText +=
			'-webkit-clip-path: url(#elastic-div__mask);clip-path: url(#elastic-div__mask);';
		if (maskpath) return maskpath;

		document.body.insertAdjacentHTML(
			'beforeend',
			`
            <svg height="0" width="0" style="position:absolute;">
                <!--   https://yqnn.github.io/svg-path-editor/ -->
                <defs>
                    <clipPath id="elastic-div__mask">
                        <path 
                            d="${this.getPath()}"
                        />
                    </clipPath>
                </defs>
            </svg>
            `
		);
		return document.querySelector('#elastic-div__mask path') as SVGPathElement;
    }

    getPath() {
        return `M0,${this.points.defaultY} Q${this.points.x},${this.points.y} ${this.width},${this.points.defaultY} L ${this.width} ${this.height + 100} L 0 ${this.height + 100} Z`
    }

    createPseudoDiv() {
        const div = document.createElement('div');
        gsap.set(div, {
            position: 'absolute',
            left: 0,
            top: 0,
            height: 200,
            width: '100%',
            zIndex: 1,
        });
        if (this.el.parentElement) {
            this.el.parentElement.appendChild(div);
        }
        gsap.set(this.el.parentElement, {position: 'relative'})
        return div;
    }
}