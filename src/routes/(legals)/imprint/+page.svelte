<script lang="ts">
    import { pages } from "$lib/site";
</script>

<section>

    <div class="content-grid prose">
        <h1>Imprint</h1>
        <p>Information in accordance with &sect;5 of TMG</p>
        <p>
            Joost Ramke<br />
            Am Rohrbruch<br />
            38108 Braunschweig<br />
            <span>Email: </span>
            <a href={pages.email.slug}>{pages.email.slug.replace('mailto:', '')}</a>
        </p>
    </div>

</section>