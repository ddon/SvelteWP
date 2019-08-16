<script>
import { fly } from 'svelte/transition';
import { RouterLink } from '@svel/router';

export let languages = null;
export let currentLanguage = '';
export let dropdown = false;


let isVisibleMenu = false;
let currentLang = null;


function getCurrentLang() {
    let lng = null;

    for (let i = 0; i < languages.length; i += 1) {
        const lang = languages[i];
        if (lang.slug === currentLanguage) {
            lng = lang;
            break;
        }
    }

    if (!lng) {
        lng = languages[0];
    }

    return lng;
}


function toggleMenu(langSlug) {
    isVisibleMenu = !isVisibleMenu;

    if (langSlug) {
        for (let i = 0; i < languages.length; i += 1) {
            const lang = languages[i];
            if (lang.slug === langSlug) {
                currentLang = lang;
                break;
            }
        }
    }
}


$: {
    if (languages.length > 0) {
        currentLang = getCurrentLang();
    }
}
</script>

<style>
.languages {
    display: flex;
    align-items: center;
}

.languages .language-link {
    display: flex;
}

.languages .language-link:hover {
    background-color: #0178a9;
}

.languages-dropdown {
    flex: 1 0 auto;
    display: flex;
    justify-content: flex-end;

    position: relative;

    transition: 200ms;
}

.languages-dropdown .language-link {
    min-width: 91px;

    display: flex;
    align-items: center;

    transition: 200ms;
}

.languages-dropdown .languages-dropdown-menu {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;

    background-color: #0178a9;

    transition: 200ms;
}

.languages-dropdown .language-link:hover {
    background-color: #0178a9;
}

.languages-dropdown .languages-dropdown-menu .language-link {
}

.languages-dropdown .languages-dropdown-menu .language-link:hover {
    background-color: #0190ca;
}
</style>


{#if languages}
    {#if dropdown}
        <nav class='languages-dropdown'>
            {#if currentLang}
                <div class='language-link' on:click='{toggleMenu}'>
                    <RouterLink to={currentLang.link} style='color: #ffffff; padding: 16px 15px 16px 15px; width: 100%;'>
                        {currentLang.name}
                    </RouterLink>
                </div>
            {/if}
            {#if isVisibleMenu}
                <div class='languages-dropdown-menu' transition:fly='{{duration: 300, x: 0}}' on:mouseleave='{toggleMenu}'>
                    {#each languages as lang}
                        <div class='language-link' on:click={() => { toggleMenu(lang.slug); }}>
                            <RouterLink to={lang.link} style='color: #ffffff; padding: 16px 15px 16px 15px; width: 100%;'>
                                {lang.name}
                            </RouterLink>
                        </div>
                    {/each}
                </div>
            {/if}
        </nav>
    {:else}
        <nav class='languages'>
            {#each languages as lang}
                <div class='language-link'>
                    <RouterLink to={lang.link} style='color: #ffffff; padding: 16px 15px 16px 15px;'>
                        {lang.name}
                    </RouterLink>
                </div>
            {/each}
        </nav>
    {/if}
{/if}
