<script>
import { RouterLink } from '@svel/router';

import Menu from '../components/Menu.svelte';
import AsideMenu from '../components/AsideMenu.svelte';
import LanguageSwitcher from '../components/LanguageSwitcher.svelte';


export let languages = [];
export let menu = null;
export let logo = '';
export let title = '';

export let data = {};


let width = 0;
let isVisibleAsideMenu = false;


function toggleAsideMenu() {
    isVisibleAsideMenu = !isVisibleAsideMenu;
}
</script>

<style>
.header {
    width: 100%;
    min-height: 50px;
    display: flex;
    background-color: #016087;
}

.header .hamburger-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 8px;

    cursor: pointer;
}

.header .hamburger-menu > div {
    width: 30px;
    height: 4px;
    background-color: #ffffff;
    margin: 3px;
}

.header .hamburger-menu:hover {
    background-color: #0178a9;
}

.header .hamburger-menu:hover > div {
    background-color: #ffffff;
}

.header .logo {
    padding: 5px;
}

.header .logo img {
    max-width: 160px;
    display: block;
}
</style>


<header class='header' bind:offsetWidth={width}>
    {#if width > 800}
        {#if logo}
            <div class='logo'>
                <RouterLink to='/' title={title}>
                    <img src={logo} alt={title} />
                </RouterLink>
            </div>
        {/if}

        <Menu menu={menu} />
        <LanguageSwitcher languages={languages} dropdown={true} />
    {:else}
        <div class='hamburger-menu' role='button' on:click={() => { toggleAsideMenu(); }}>
            <div />
            <div />
            <div />
        </div>

        {#if logo}
            <div class='logo'>
                <RouterLink to='/' title={title}>
                    <img src={logo} alt={title} />
                </RouterLink>
            </div>
        {/if}

        <LanguageSwitcher languages={languages} dropdown={true} />
    {/if}
</header>

<AsideMenu
    visible={isVisibleAsideMenu}
    logo={logo}
    title={title}
    menu={menu}
    on:close={() => { toggleAsideMenu(); }}
/>
