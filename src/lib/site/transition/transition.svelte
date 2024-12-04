<script lang="ts">
	import { blur } from 'svelte/transition';
	import { disableScrollHandling, afterNavigate, beforeNavigate } from '$app/navigation';
	import { MotionFlip } from './motion-flip';
	import gsap from 'gsap';
	import Flip from 'gsap/dist/Flip';
	import CustomEase from 'gsap/dist/CustomEase';

	let { key, children }: { key: any; children: () => any } = $props();

	let clone: HTMLElement | null = null;
	let cloneInner: HTMLElement | null = null;
	let flipState: Flip.FlipState | null = null;
	// svelte-ignore non_reactive_update
	let handleTransitionEnd: () => void = () => {};

	$effect(() => {
		gsap.registerPlugin(CustomEase, Flip);
		CustomEase.create('smooth-in', '.5,.25,0,1.05');
	});

	beforeNavigate((navigation) => {
		const slugName = navigation?.to?.params?.slug;
		const target = document.querySelector(`[data-flip-id="thumbnail-${slugName}"]:not(.flip-target):not(.flip-none)`);
		if (!target) return;

		clone = document.createElement('div');
		clone.classList.add('flip-clone');
		cloneInner = target.cloneNode(true) as HTMLElement;
		const flipID = target.getAttribute('data-flip-id');
		cloneInner.removeAttribute('data-flip-id');
		clone.setAttribute('data-flip-id', flipID || '');
		clone.appendChild(cloneInner);
		Flip.fit(clone, target, {
			absolute: true,
		});
		gsap.set(cloneInner, {
			y: window.scrollY,
			x: 0,
		});
		document.body.appendChild(clone);
		gsap.set(target, {
			display: 'none',
		});
		// to remove movement styles from hover image
		gsap.to(cloneInner, {
			scale: 1,
			rotate: 0,
		});
	});

	afterNavigate(() => {
		// Prevents sveltekit from scrolling back to top during the out transition
		disableScrollHandling();
	});

	handleTransitionEnd = () => {
		if (!clone) return;

		if (cloneInner) {
			gsap.set(cloneInner, {
				y: 0,
				clearProps: 'all',
			});
		}

		const target = document.querySelector('[data-flip-id].flip-target');
		if (!target) return;

		target.classList.add('targeting');

		setTimeout(() => {
			flipState = Flip.getState(target);
			if (!flipState) return;

			new MotionFlip(clone!, flipState, 0.8, () => {
				Flip.to(flipState!, {
					targets: clone,
					duration: 0.8,
					absolute: true,
					ease: 'smooth-in',
					onComplete: () => {
						target.classList.add('flip-done');
						clone?.remove();
						gsap.killTweensOf(clone);
						clone = null;
						cloneInner = null;
					},
				});
			});
		}, 10);
	};
</script>

{#key key}
	<div in:blur={{ duration: 275, delay: 150, amount: 6 }} out:blur={{ duration: 150, amount: 6 }} onoutroend={handleTransitionEnd}>
		{@render children()}
	</div>
{/key}
