import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getScrollbarWidth() {
	const documentWidth = document.documentElement.clientWidth;
	return Math.abs(window.innerWidth - documentWidth);
}

export function lerp(v0: number, v1: number, t: number): number {
	return v0 * (1 - t) + v1 * t;
}

export function clamp(val: number, min: number, max: number): number {
	return Math.min(Math.max(val, min), max);
}

export function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function getAge() {
	return Math.floor((new Date().getTime() - new Date('2001-08-02').getTime()) / 3.15576e10);
}

export function getRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
