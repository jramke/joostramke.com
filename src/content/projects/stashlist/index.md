---
# hidden: true
title: 'Stashlist'
tags:
    - Development
    - Design
date: '2024-05-10'
externalLink: 'https://stashlist.app'
githubLink: 'https://github.com/jramke/stashlist'
highlight: true
client: 'Side project'
thumbnailAlt: 'Screenshot of the Stashlist landing page hero.'
---

<script>
    import { Image } from '$lib/components/image';
    import * as Tooltip from '$lib/components/tooltip';

    import Stashes from './stashes.jpeg?enhanced';
    import Groups from './groups.jpeg?enhanced';
    import Extension from './extension.jpeg?enhanced';
    import OhNo from './oh-no.jpeg?enhanced';
    import OhNoV2 from './oh-no-v2.jpeg?enhanced';
    import Launcher from './launcher.png?enhanced';
</script>

Stashlist is a bookmark manager and the creative vault for designers and engineers. It lets you stash websites, images and text snippets all in one place, making it easy to keep track of your creative resources.

## The idea

I was looking for a bookmark manager with a nice UI, because I found myself over and over again searching through browser and twitter bookmarks, codepen demos, dribble shots and github stars to find that one useful link I saved back then.

I found <a href="https://bmrks.com/" target="_blank">bmrks.com</a> by <a href="https://x.com/raunofreiberg" target="_blank">@raunofreiberg</a> that is not as bloated as something like <a href="https://raindrop.io/" target="_blank">Raindrop.io</a>, but there were a few features missing that I would like to have, like:

- Saving Images alongside links and text snippets
- Live view of saved websites
- Automatic metadata fetching
- Many-to-Many grouping system
- Unsorted inbox
- Intuitive keyboard support
- Quick access via browser extension and/or desktop launcher app

So I started building my own.

## Implementation

I used <a href="https://kit.svelte.dev/" target="_blank">Sveltekit</a> with Typescript as the framework. To ensure a consistent styling across the different apps I explored the configuration pain of monorepos. In this case I used <a href="https://turbo.build/" target="_blank">Turborepo</a>. After the setup it worked smoothly.

First I started with the web app which handles all the main logics and api endpoints. For user authentication I used <a href="https://lucia-auth.com/" target="_blank">Lucia</a> to keep control over the user data which is stored in a SQLite database.

<Image image={Stashes} alt="Screenshot of the Stashlist web app UI." />

<Image image={Groups} alt="Screenshot of the Stashlist groups list." />

## Browser extension

After the main web app, I started to build the browser extension (currently only a chrome extension). I wanted a way to quickly save websites while browsing. It's possible to save websites or images via the right click menu or a shortcut. The browser extension is built in svelte as well.

<Image image={Extension} alt="Screenshot of the extensions dialog when stashing a new site." />

## Desktop launcher app

The extension wasn't that helpful when we want to access saved resources quickly, because it's always bound to the browser. The idea was a desktop launcher app which can be opened with a shortcut. When thinking about a desktop launcher app you quickly think of <a href="https://www.raycast.com/" target="_blank">Raycast</a> with it's great API to integrate custom extensions. But because im on windows and Raycast is (currently) mac only this is not the best suited solution. So I built a custom desktop app with <a href="https://tauri.app/" target="_blank">Tauri</a> in order to use Svelte there as well.

While for the browser extension the authentication cookies set from logging into the web app could be used, we couldn't utilize this for the desktop app, because it's running in a different context. So I added API Key functionality to Stashlist, that lets users generate their own secure API Key and connect their desktop launcher to their Stashlist account.

## Conclusion and future plans

Stashlist was the largest site project I've built so far and I learned a lot from it. Building Stashlist was a lot of fun, cause it's a tool I use nearly daily myself. But as a side project this was also a drawback, because you get ideas for new features and improvements all the time. Finding time for this is hard. At the time of writing this the last commit was 3 month ago and there are a lot of github issues with the `enhancement` tag on it. Of course there are also some little bugs.

My future plan is to <Tooltip.Root><Tooltip.Trigger class=text-tooltip>refactor</Tooltip.Trigger><Tooltip.Content class=not-prose><Image image={OhNo} omitFigure={true} alt='A comic with two beavers. One says, "i have big plans for this code." Another replies, "please, no more refactors." The first responds, "big plans.' /></Tooltip.Content></Tooltip.Root> or <Tooltip.Root><Tooltip.Trigger class=text-tooltip>rewrite</Tooltip.Trigger><Tooltip.Content class=not-prose><Image image={OhNoV2} omitFigure={true} alt='A software engineer plans a project, then later sees a chaotic, multilevel structure of buildings, realizing past mistakes have been repeated.' /></Tooltip.Content></Tooltip.Root> the project when I have time. I used a beta version of Tauri v2 and the official version is released now. Svelte 5 is also about to be released. Other reasons are that i want to explore a local-first approach and in general include all the new learnings I got since building this.

Let's revisit this in a year to see if it happened <span role="img" aria-label="Grinning face with sweat">😅</span>.

<Image image={Launcher} alt="Screenshot of the Stashlist desktop launcher UI." />
