<script>
import { RouterLink } from '@svel/router';

export let languages = null;
</script>

<style>
.languages {
    display: flex;
}

.languages .language-link {
    padding: 10px 15px 10px 15px;
}
</style>


{#if languages}
<nav class='languages'>
    {#each languages as lang}
        <div class='language-link'>
            <RouterLink to={lang.link}>{lang.name}</RouterLink>
        </div>
    {/each}
</nav>
{/if}
