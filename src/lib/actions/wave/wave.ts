import type { Action } from 'svelte/action';
import gsap from 'gsap';

// TODO: easter egg when heavily shaking the mouse
export const wave: Action<HTMLElement> = (el) => {
	let active = false;
	let startAnimationDone = false;
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			entry.intersectionRatio > 0 ? (active = true) : (active = false);
		});
	});

	function handleMousemove(e: MouseEvent) {
		if (!active || !startAnimationDone) return;
		const x = e.clientX;
		const relCenterX = (x - window.innerWidth / 2) / window.innerWidth;
		const angle = (relCenterX * 180) / Math.PI;
		gsap.to(el, { rotate: angle });
	}

	function update() {
		gsap.set(el, {
			transformOrigin: '55% 90%',
		});
		const waveTL = gsap.timeline({
			defaults: {
				duration: 0.2,
				ease: 'power1.out',
			},
			onComplete: () => {
				startAnimationDone = true;
			},
		});
		waveTL.to(el, { rotate: -25, duration: 0.15 });
		waveTL.to(el, { rotate: 20 });
		waveTL.to(el, { rotate: -15 });
		waveTL.to(el, { rotate: 15 });
		waveTL.to(el, { rotate: 0 });

		observer.observe(el);
		window.addEventListener('mousemove', handleMousemove);
	}

	function destroy() {
		window.removeEventListener('mousemove', handleMousemove);
		observer.disconnect();
	}

	update();
	return {
		update,
		destroy,
	};
};
