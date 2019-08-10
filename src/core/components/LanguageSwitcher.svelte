<script>
import { RouterLink } from '@svel/router';
import { RouterView, getRoute } from '@svel/router';


let route = getRoute();

export let languages = null;
export let currentLanguage = '';
export let dropdown = false;


function isCurrentLang(lang) {
    return lang.slug === currentLanguage;
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
    flex: 1 0 auto;

    display: flex;
    justify-content: flex-end;

    position: relative;

    transition: 200ms;
    transition-delay: 200ms;
}

.languages-dropdown .language-link {
    min-width: 65px;

    display: flex;
    align-items: center;
    padding: 10px 15px 10px 15px;

    transition: 200ms;
    transition-delay: 200ms;
}

.languages-dropdown .languages-dropdown-menu {
    position: absolute;
    top: 0;
    right: 0;

    background-color: #dddddd;

    visibility: hidden;
    opacity: 0;
    z-index: 100;

    transition: 200ms;
    transition-delay: 200ms;
}

.languages-dropdown:hover .language-link {
    background-color: #0178a9;
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
                        <RouterLink to={lang.link} style='color: #ffffff;'>
                            {lang.name}
                        </RouterLink>
                    </div>
                {/if}
            {/each}
            <div class='languages-dropdown-menu'>
                {#each languages as lang}
                    <div class='language-link'>
                        <RouterLink to={lang.link} style='color: #ffffff;'>
                            {lang.name}
                        </RouterLink>
                    </div>
                {/each}
            </div>
        </nav>
    {:else}
        <nav class='languages'>
            {#each languages as lang}
                <div class='language-link'>
                    <RouterLink to={lang.link} style='color: #ffffff;'>
                        {lang.name}
                    </RouterLink>
                </div>
            {/each}
        </nav>
    {/if}
{/if}
