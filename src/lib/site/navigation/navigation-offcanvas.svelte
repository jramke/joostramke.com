<script lang="ts">
	import gsap from 'gsap';
	import { cn, getScrollbarWidth } from '$lib/utils';
	import NavigationBackdrop from './navigation-backdrop.svelte';
	import { offcanvasPages, pages, socialPages } from '$lib/site';
	import { flyScaleBlur } from '$lib/transitions';
	import { getNavigationState } from './state.svelte';
	import { Keyboard } from '$lib/components/keyboard';
	import * as Tooltip from '$lib/components/tooltip';

	const { showToggle, offcanvasState, transitioning, setOffcanvasState, openOrOpening } = $derived(getNavigationState());

	let navcanvas: HTMLElement;
	// svelte-ignore non_reactive_update
	let toggleBtn: HTMLButtonElement;
	let canvasMaskPathOpen: SVGPathElement;
	let canvasMaskPathClose: SVGPathElement;

	let shortcutLinks: HTMLAnchorElement[] = [];

	$effect(() => {
		// show();
		const abortController = new AbortController();

		const canvaslinks = navcanvas.querySelectorAll('a');
		canvaslinks.forEach((e) => {
			e.addEventListener('click', hide, { signal: abortController.signal });
		});

		let resizeTimeout: ReturnType<typeof setTimeout>;
		window.addEventListener(
			'resize',
			() => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => {
					setDivWidth();
				}, 100);
			},
			{ signal: abortController.signal },
		);

		window.addEventListener(
			'keydown',
			(e: KeyboardEvent) => {
				if (e.key === 'Escape' && offcanvasState === 'open') {
					hide();
				}
				// cmd + m minimizes the browser on mac :/
				if (e.key.toLowerCase() === 'm' && e.shiftKey) {
					toggle();
				}
				shortcutLinks.forEach((link, i) => {
					if (e.key === `${i + 1}` && offcanvasState === 'open') {
						e.preventDefault();
						link.focus();
						link.click();
					}
				});
			},
			{ signal: abortController.signal },
		);

		return () => {
			abortController.abort();
			resizeTimeout && clearTimeout(resizeTimeout);
		};
	});

	function toggle() {
		if (offcanvasState === 'closed' || offcanvasState === 'closing') {
			show();
		} else {
			hide();
		}
	}

	function show() {
		if (transitioning === true) {
			return;
		}
		if (toggleBtn) toggleBtn.style.marginRight = `${getScrollbarWidth()}px`;
		document.body.style.paddingRight = `${getScrollbarWidth()}px`;
		setOffcanvasState('opening');
		animateIn();
	}
	function hide() {
		if (transitioning === true) {
			return;
		}
		setOffcanvasState('closing');
		animateOut();
	}

	function animateIn() {
		gsap.set(canvasMaskPathOpen, {
			attr: {
				d: canvasMaskPathOpen?.dataset?.pathOpen ?? '',
			},
		});
		gsap.to(navcanvas, {
			duration: 1.5,
			ease: 'elastic.out(0.6,0.7)',
			'--rounded-div-width-open': '0px',
		});
		gsap.to(navcanvas, {
			duration: 1.2,
			ease: 'elastic.out(0.6,0.7)',
			'--xPercent': '0',
			onComplete: () => {
				setOffcanvasState('open');
			},
		});
	}
	function animateOut() {
		const tl = gsap.timeline({
			onComplete: () => {
				gsap.set(canvasMaskPathClose, {
					attr: { d: canvasMaskPathClose?.dataset?.pathNormal ?? '' },
				});
				gsap.set(canvasMaskPathOpen, {
					attr: { d: canvasMaskPathOpen?.dataset?.pathOpen ?? '' },
				});
				setDivWidth();
				navcanvas.querySelectorAll('[data-aos]').forEach((e) => e.classList.remove('aos-animate'));
				setOffcanvasState('closed');
				if (toggleBtn) toggleBtn.style.marginRight = '';
				document.body.style.paddingRight = '';
			},
		});
		tl.to(canvasMaskPathClose, {
			duration: 1.05,
			ease: 'elastic.out(1,10)',
			attr: {
				d: canvasMaskPathClose.dataset.pathClose ?? '',
			},
		});
		tl.to(
			navcanvas,
			{
				duration: 0.85,
				ease: 'elastic.out(.5,15)',
				'--xPercent': '100',
			},
			0,
		);
		tl.to(
			navcanvas,
			{
				duration: 0.3,
				ease: 'elastic.out(0.1,5)',
				'--rounded-div-width-close': '0px',
			},
			0.2,
		);
	}

	function setDivWidth() {
		let staticWidthOpen = getComputedStyle(navcanvas).getPropertyValue('--rounded-div-width-open-static');
		let staticWidthClose = getComputedStyle(navcanvas).getPropertyValue('--rounded-div-width-close-static');
		if (offcanvasState === 'open') {
			return;
		}
		gsap.set(navcanvas, {
			'--rounded-div-width-open': staticWidthOpen,
			'--rounded-div-width-close': staticWidthClose,
		});
	}
</script>

<!-- TODO: improve keyboard focusablility -->
{#if showToggle}
	<div class="fixed top-8 right-8 lg:right-10 lg:top-10 z-[52]">
		<Tooltip.Root delayDuration={1500}>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button
						{...props}
						transition:flyScaleBlur={{ y: -8 }}
						bind:this={toggleBtn}
						onclick={() => toggle()}
						class={cn('font-medium transition-[box-shadow] px-2 py-1 rounded-lg border border-border bg-white', !openOrOpening && 'shadow-md')}
						aria-expanded={openOrOpening}
						aria-controls="navcanvas"
					>
						<span aria-hidden="true" class="flex items-center gap-2">
							{openOrOpening ? 'close' : 'menu'}
						</span>
						<span class="sr-only">{openOrOpening ? 'Close menu' : 'Open menu'}</span>
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<!-- ZINDEX TODO: a -->
			<Tooltip.Content side="bottom" align="end">
				<span class="flex items-center gap-2 text-muted text-xs">
					Shortcut: <Keyboard keys={['shift', 'M']} />
				</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
{/if}

{#if offcanvasState === 'open' || offcanvasState === 'opening'}
	<NavigationBackdrop onclick={hide} />
{/if}

<svg height="0" width="0" style="position:absolute;">
	<defs>
		<clipPath id="offcanvas__mask-open" clipPathUnits="objectBoundingBox">
			<path
				bind:this={canvasMaskPathOpen}
				d="M 0 0 C 0 0.25 0 0.75 0 1 L 1 1 L 1 0 Z"
				data-path-normal="M 0 0 C 0 0.25 0 0.75 0 1 L 1 1 L 1 0 Z"
				data-path-open="M 1 0 C -0.333 0.25 -0.333 0.75 1 1 L 1 1 L 1 0 Z"
			/>
		</clipPath>
		<clipPath id="offcanvas__mask-close" clipPathUnits="objectBoundingBox">
			<path
				bind:this={canvasMaskPathClose}
				d="M 0 0 C 0 0.25 0 0.75 0 1 L 1 1 L 1 0 Z"
				data-path-normal="M 0 0 C 0 0.25 0 0.75 0 1 L 1 1 L 1 0 Z"
				data-path-close="M 0 0 C 1.333 0.25 1.333 0.75 0 1 L 1 1 L 1 0 Z"
			/>
		</clipPath>
	</defs>
</svg>
<div
	class={cn(
		'offcanvas fixed z-[51] top-0 right-0 translate-x-[calc(var(--xPercent)*1%+var(--rounded-div-width-open)*2)] bg-background h-[100vh] w-[500px] max-w-[100vw]',
		openOrOpening && 'show',
		offcanvasState === 'closed' && 'hidden',
	)}
	tabindex="-1"
	id="navcanvas"
	bind:this={navcanvas}
	style="--xPercent: 100; --rounded-div-width-open: 100px; --rounded-div-width-close: 100px; --rounded-div-width-static: 100px;"
>
	<div class="offcanvas__rounded-div-open"></div>
	<div class="offcanvas__rounded-div-close"></div>
	<div class={cn('relative size-full', 'after:absolute after:top-0 after:left-[calc(100%-1px)] after:w-[100px] after:h-full after:bg-background')}>
		<nav class="py-28 pb-14 md:py-36 lg:py-48 px-8 lg:px-10 lg:pl-4 h-full flex flex-col justify-between">
			<div>
				<span class={cn('text-muted inline-block pb-3', 'opacity-0', offcanvasState !== 'closed' && 'animate-fade-in-left')} style="--amount: 1rem;">
					Navigation
				</span>
				<ul class="space-y-3">
					{#each offcanvasPages as { slug, title, target }, index}
						{@render navitem(slug, title, target, index + 1)}
					{/each}
					{@render navitem(pages.colophon.slug, pages.colophon.title, pages.colophon.target, offcanvasPages.length + 1)}
				</ul>
			</div>
			<div>
				<span class={cn('text-muted inline-block pb-2', 'opacity-0', offcanvasState !== 'closed' && 'animate-fade-in-bottom')} style="--amount: 1rem;">
					Socials
				</span>
				<ul class="flex gap-4 max-sm:flex-col max-sm:gap-2">
					{#each socialPages as { slug, title, target }, index}
						{@render socialitem(slug, title, target, index)}
					{/each}
				</ul>
			</div>
		</nav>
	</div>
</div>

{#snippet navitem(slug: string, title: string, target: string | null, shortcutNumber: number)}
	<li>
		<a
			href={slug}
			{target}
			bind:this={shortcutLinks[shortcutNumber - 1]}
			class={cn('group flex gap-3 items-center justify-between [&_kbd]:hover:bg-white', 'opacity-0', offcanvasState !== 'closed' && 'animate-fade-in-left')}
			style="--delay: {(shortcutNumber - 1) * 0.02}s; --amount: 3rem;"
			data-no-external-icon
		>
			<span class="font-medium transition-all group-hover:font-[600] group-focus-visible:font-[600]">
				{title}
			</span>
			<div aria-hidden="true" class="bg-border transition-colors h-[1px] w-full group-hover:bg-foreground/50 group-focus-visible:bg-foreground/50"></div>
			<span>
				<Keyboard keys={[shortcutNumber.toString()]} />
			</span>
		</a>
	</li>
{/snippet}

{#snippet socialitem(slug: string, title: string, target: string | null, index: number)}
	<li>
		<a
			href={slug}
			{target}
			class={cn(
				'font-medium transition-all hover:font-[650] focus-visible:font-[650]',
				'opacity-0 inline-block',
				offcanvasState !== 'closed' && 'animate-fade-in-bottom',
			)}
			style="--delay: {index * 0.05}s; --amount: 1rem;"
		>
			{title}
		</a>
	</li>
{/snippet}
