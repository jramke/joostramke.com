<script lang="ts">
    // import * as Tooltip from "$lib/components/tooltip";
	import { Image } from "$lib/components/image";
	import { pages } from "$lib/site";
    import { cn, getAge } from "$lib/utils";
	import Arrow from "./arrow.svelte";

    import Me from "$assets/me.jpg";

</script>

<section>

    <div class="content-grid prose">
        <h1>About me</h1>
        <p>
            I'm Joost Ramke a {getAge()} years old 
            Design Engineer
            <!-- TODO: hydration_mismatch warning and layout flickering cause tooltip renders div in p tag wich is forbidden -->
            <!-- <Tooltip.Root>
                <Tooltip.Trigger class="text-tooltip">
                    Design Engineer
                </Tooltip.Trigger>
                <Tooltip.Content>
                    Someone who works at the intersection of design and code
                </Tooltip.Content>
            </Tooltip.Root> -->
            passionate about building digital experiences that seamlessly blend form and function. 
            At <a href="https://brainworxx.de" target="_blank">Brainworxx</a>, 
            I'm dedicated to pushing the boundaries of design and development to create innovative solutions that solve real-world problems.
        </p>
        
        <div class="flex items-center gap-9">
            <div class={cn(
                "w-[250px] shrink-0 peer -rotate-[6deg] mt-8 mb-2 bg-white spring-bounce-[40] spring-duration-[250] rounded-[2px] p-3 shadow-xl shadow-foreground/[.06] flex",
                "[&>figure]:mt-0 [&>figure]:mb-10",
                "hover:scale-110 hover:-rotate-2 hover:shadow-foreground/[.03]",
                "max-reading:ml-2.5"
            )}>
                <Image src={Me} alt="Joost Ramke" class="aspect-[0.95] object-cover object-[50%_30%]" />
            </div>
            <div class={cn(
                "flex gap-5 transition-colors duration-200",
                "[&>svg]:opacity-90",
                "peer-hover:text-foreground",
                "max-sm:hidden"
            )}>
                <Arrow class="w-20" />
                <span class="whitespace-nowrap font-handwriting text-2xl -translate-y-2">Hi, nice to meet you :)</span>
            </div>
        </div>

        <h2>My journey</h2>
        <p>
            Everything started behind the camera from my dad, capturing beautiful moments through a lens — something that still brings me joy <a href={pages.gallery.slug}>today</a>.
        </p>
        <p>
            But I also loved working with computers and discovered my passion for graphic design. Driven by a desire to bring ideas to life, this passion more and more shifted towards web design and more interactive stuff.
            In 2019 I finally started to code wich opened up a whole new world for me. 
        </p>
        <p>
            I love working at the intersection of design and code. I'm obsessed with carefully crafted components, robust design systems and excellent animations.
        </p>
        <p>
            For all the nerdy details, feel free to browse my <a href={pages.cv.slug} target={pages.cv.target}>{pages.cv.title}</a>.
        </p>

        <h2>Sports</h2>
        <p>
            In addition to everything else, sports play a big role in my life. I love football and have been playing it since I was a kid — around 20 years in several clubs.
        </p>
        <p>
            I also enjoy trying out new sports like skating, skiing, judo, or archery. Currently, I'm focusing on weightlifting and bodybuilding.
        </p>
    </div> 
</section>  