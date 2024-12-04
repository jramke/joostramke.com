---
# hidden: true
title: 'Carve UI'
tags:
    - Development
    - Design
date: '2024-11-01'
externalLink: 'https://carve.joostramke.com'
githubLink: 'https://github.com/jramke/carve-ui'
highlight: true
client: 'Side project'
thumbnailAlt: 'Snowy mountains in the background and the text "Carve UI" with logo in the foreground'
---

<script>
    import { Image } from '$lib/components/image';

</script>

Carve UI is a rugged and accessible headless component library for [Alpine.js](https://alpinejs.dev/). It provides powerful building blocks designed to be flexible and accessible.

When I recently discovered Alpine.js, I was amazed. It was a perfect fit for sites that require only a few sprinkles of JavaScript for interactivity, allowing you to use framework agnostic markup.

## The Problem

The problem was that I couldn't find a good open-source component library that was truly accessible—not just claiming to be. All the libraries I found:

- Weren't genuinely accessible
- Embedded logic directly into the markup, making it cluttered
- Were primarily for copy-paste usage, like [shadcn/ui](https://ui.shadcn.com/)

These didn't suit my use case. I ...

- Needed accessible components that support WCAG AA
- Didn't want to create a component file for every functionality
- Wanted a package I could install that would receive continuous bug fixes and improvements

I wanted something similar to [Bits UI](https://bits-ui.com/docs/introduction) or [Radix Primitives](https://www.radix-ui.com/primitives) but tailored for Alpine. So, I decided to start building my own reusable primitives.

## The Solution

I crafted common primitives that can be easily used in your markup. Each component requires a wrapping `x-data` attribute containing the state and functionality, like `x-data="tooltip()"`, which allows the user to pass options if needed.

All other component parts are defined with an `x-ref` attribute, such as `x-ref="trigger"`. Carve UI binds all necessary attributes and event listeners to that element and manages state changes.

This approach allows us to implement headless, fine-grained, and accessible interactivity that can be styled in any way.
