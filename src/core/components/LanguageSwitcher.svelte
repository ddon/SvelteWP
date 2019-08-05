<script>
import { RouterLink } from '@svel/router';
import { RouterView, getRoute } from '@svel/router';


let route = getRoute();

export let languages = null;
export let dropdown = false;


function isCurrentLang(lang) {
    return lang.link === $route.path;
}
</script>

<style>
.languages {
    display: flex;
}

.languages .language-link {
    padding: 10px 15px 10px 15px;
}

.languages-dropdown {
    position: relative;
    min-width: 100px;

    transition: 200ms;
    transition-delay: 200ms;
}

.languages-dropdown .language-link {
    padding: 10px 15px 10px 15px;
}

.languages-dropdown .languages-dropdown-menu {
    min-width: 100px;
    position: absolute;
    top: 38px;
    right: 0;

    background-color: #ddd;

    visibility: hidden;
    opacity: 0;
    z-index: 100;

    transition: 200ms;
    transition-delay: 200ms;
}

.languages-dropdown:hover {
    background-color: #ddd;
}

.languages-dropdown:hover .languages-dropdown-menu {
    visibility: visible;
    opacity: 1;
}
</style>


{#if languages}
    {#if dropdown}
        <nav class='languages-dropdown'>
            {#each languages as lang}
                {#if isCurrentLang(lang)}
                    <div class='language-link'>
                        <RouterLink to={lang.link}>{lang.name}</RouterLink>
                    </div>
                {/if}
            {/each}
            <div class='languages-dropdown-menu'>
                {#each languages as lang}
                    {#if !isCurrentLang(lang)}
                        <div class='language-link'>
                            <RouterLink to={lang.link}>{lang.name}</RouterLink>
                        </div>
                    {/if}
                {/each}
            </div>
        </nav>
    {:else}
        <nav class='languages'>
            {#each languages as lang}
                <div class='language-link'>
                    <RouterLink to={lang.link}>{lang.name}</RouterLink>
                </div>
            {/each}
        </nav>
    {/if}
{/if}
