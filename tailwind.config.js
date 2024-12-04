import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				reading: '787px', // when content-grid's reading hits full width
			},
			container: {
				center: true,
				padding: '2rem',
			},
			transitionProperty: {
				height: 'height',
				width: 'width',
				size: 'width, height',
				spacing: 'margin, padding',
			},
			colors: {
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				muted: 'hsl(var(--muted) / <alpha-value>)',
				border: 'hsl(var(--border) / <alpha-value>)',
				secondary: 'hsl(var(--secondary) / <alpha-value>)',
			},
			spacing: {
				reading: '67ch',
				breakout: '92ch',
				'breakout-lg': '104ch',
				section: '7rem',
				'section-inner': '4rem',
			},
			fontFamily: {
				// sans: ['PublicSans-Variable', ...fontFamily.sans],
				// sans: ['GeneralSans-Variable', ...fontFamily.sans],
				// sans: ['Pretendard Variable', ...fontFamily.sans],
				// sans: ['Switzer-Variable', ...fontFamily.sans],
				// sans: ['Overused Grotesk', ...fontFamily.sans],
				// sans: ['Plus Jakarta Sans', ...fontFamily.sans],
				sans: ['InterVariable', ...fontFamily.sans],
				handwriting: ['Reenie Beanie', ...fontFamily.sans],
			},
			animation: {
				'opacity-in': 'opacity-in 0.3s ease-in-out',
				'fade-in-bottom': 'fade-in-bottom 0.6s var(--delay, 0s) cubic-bezier(.4,0,0,1) forwards',
				'fade-in-left': 'fade-in-left 0.6s var(--delay, 0s) cubic-bezier(.4,0,0,1) forwards',
				'blur-in': 'blur-in 0.6s var(--delay, 0s) cubic-bezier(.4,0,0,1) forwards',
			},
			keyframes: {
				'opacity-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				'fade-in-bottom': {
					'0%': {
						opacity: 0,
						transform: 'translateY(var(--amount, max(2.5rem, 100%))) scaleY(2)',
						filter: 'blur(2px)',
					},
					'100%': {
						opacity: 1,
						transform: 'translateY(0) scaleY(1)',
						filter: 'blur(0)',
					},
				},
				'fade-in-left': {
					'0%': {
						opacity: 0,
						transformOrigin: 'left',
						transform: 'translateX(var(--amount, max(1.5rem, 100%))) scaleX(2)',
						filter: 'blur(2px)',
					},
					'99.9%': {
						transformOrigin: 'left',
					},
					'100%': {
						opacity: 1,
						transformOrigin: 'initial',
						transform: 'translateX(0) scaleX(1)',
						filter: 'blur(0)',
					},
				},
				'blur-in': {
					'0%': {
						opacity: 0,
						filter: 'blur(10px)',
					},
					'100%': {
						opacity: 1,
						filter: 'blur(0)',
					},
				},
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': 'hsl(var(--secondary))',
						'--tw-prose-link': 'hsl(var(--foreground))',
						'--tw-prose-headings': 'hsl(var(--foreground))',
						'--tw-prose-captions': 'hsl(var(--secondary))',
						lineHeight: '1.5',
						maxWidth: 'none',
						a: {
							textDecoration: 'none',
						},
						p: {
							marginTop: '0.75em',
							marginBottom: '0.75em',
						},
						h1: {
							fontSize: 'inherit',
							fontWeight: '600',
							lineHeight: 'inherit',
							marginTop: '3em',
						},
						h2: {
							fontSize: 'inherit',
							fontWeight: '500',
							lineHeight: 'inherit',
							marginTop: '3em',
						},
						h3: {
							fontSize: 'inherit',
							fontWeight: '500',
							lineHeight: 'inherit',
							marginTop: '3em',
						},
						h4: {
							fontSize: 'inherit',
							fontWeight: '500',
							lineHeight: 'inherit',
							marginTop: '3em',
						},
						h5: {
							fontSize: 'inherit',
							fontWeight: '500',
							lineHeight: 'inherit',
							marginTop: '3em',
						},
						code: {
							backgroundColor: 'hsl(var(--muted) / 0.2)',
							borderRadius: '0.25em',
							padding: '0 0.2em',
						},
						figcaption: {
							marginTop: '0.5em',
						},
						ul: {
							marginTop: '0.75em',
							marginBottom: '0.75em',
						},
					},
				},
			}),
		},
	},
	plugins: [require('tailwindcss-spring'), require('@tailwindcss/typography')],
};
