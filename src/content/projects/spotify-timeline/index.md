---
# hidden: true
title: "Spotify Timeline"
tags: 
    - Development
    - Design
date: '2024-08-10'
externalLink: 'https://spotify.joostramke.com'
githubLink: 'https://github.com/jramke/spotify-timeline'
highlight: true
client: 'Side project'
thumbnailAlt: 'Screenshot of the spotify timeline web app displaying a spotify timeline on green background'
---

<script>
    import { Video } from '$lib/components/video';
    import Timeline from './timeline.mp4';
</script>

Spotify Timeline is a little site where you can explore beautiful timelines of your Spotify playlists. It let's you view all your songs grouped by months in a smooth minimalistic timeline chart.

## The idea
I'm one of the guys who uses a large playlist for all my songs, and not spotify's like functionality. So have you ever wanted to know what era the songs you listen to are from? I did, so i created this little site.

## Implementation
The site is build using <a href="https://nextjs.org/" target="_blank">Nextjs</a> and <a href="https://react.dev/" target="_blank">React</a> with TypeScript. 
To get private playlists form a Spotify user via the Spotify API we need an access token. To get this I implemented OAuth login and store the users keys in a SQLite database. 

The main part of the app is the timeline component. It  consists of two individual components. The first one is a mouse follower with keyboard support using <a href="https://www.framer.com/motion/" target="_blank">Framer Motion</a> to indicate the active item. The second is the scrollarea which is built on top of <a href="https://www.radix-ui.com/" target="_blank">Radix UI's</a> scrollarea primitive. Enhanced with a nice css `animation-timeline` gradient mask and a custom `useMousescroll` hook to let the user easily explore the timeline by moving the mouse to the edges.

<Video 
    src={Timeline} 
    autoplay={true} 
    muted={true} 
    loop={true} 
    figcaption="Screenrecording of an interaction with the timeline." 
/>

## Conclusion
I have to admit, that this was my first time working with Nextjs. I'm coming from a background in <a href="https://kit.svelte.dev/" target="_blank">Sveltekit</a> and <a href="https://typo3.org/" target="_blank">TYPO3</a> a PHP content management system and framework. 

Nextjs is really nice when you're in the flow with it. However, I think getting in this flow isn't that easy because it comes here and there with quite some abstractions. And I think some of them are easy to overlook and doing a not so small amount of magic behind the scenes.

In conclusion it also showed my how easy it is to adapt to a new JavaScript framework if you know the language, its concepts and the web's basics in general.