<script>
import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';

import { RouterLink } from '@svel/router';

import AsideSubMenu from './AsideSubMenu.svelte';
import { isAbsLink } from './../lib/links';


const dispatch = createEventDispatcher();

export let visible = false;
export let logo = '';
export let title = '';
export let menu = null;


let menuStatuses = {};


function toggleMenu(url) {
    menuStatuses[url] = !menuStatuses[url];
}

$: {
    if (!visible) {
        menuStatuses = {};
    }
}
</script>

<style>
.aside-menu-layout {
    position: absolute;

    width: 100vw;
    height: 100vh;
    z-index: 99;

    background-color: #000000;
    opacity: 0.3;
}

.aside-menu {
    position: fixed;
    top: 0;
    left: 0;

    height: 100%;
    max-width: 50%;
    overflow-x: scroll;
    height: 100%;

    background-color: #016087;
    z-index: 100;
}

.aside-menu .logo {
    margin: 10px 50px 0 50px;
}

.aside-menu .logo img {
    width: 100%;
    max-width: 150px;
}

.aside-menu .close {
    position: absolute;
    top: 0;
    left: 0;

    width: 50px;
    height: 50px;

    cursor: pointer;
    opacity: 0.9;
}

.aside-menu .close:hover {
    opacity: 1;
}

.aside-menu .close:before, .close:after {
    position: absolute;
    top: 12px;
    left: 22px;
    content: ' ';
    height: 25px;
    width: 5px;
    background-color: #ffffff;
}

.aside-menu .close:before {
    transform: rotate(45deg);
}

.aside-menu .close:after {
    transform: rotate(-45deg);
}

.aside-menu .menu {
    list-style: none;
    margin: 15px 0 0 0;
    padding: 0;
    width: 100%;
}

.aside-menu .menu .menu-item {
    position: relative;
    display: flex;
    flex-direction: column;

    transition: 200ms;
}

.aside-menu .menu .menu-item:hover {
    background-color: #0178a9;
}

.aside-menu .menu .menu-item-wrapper {
    display: flex;
}

.aside-menu .menu .menu-item-link-container {
    flex: 1 0 auto;
}

.aside-menu .menu .menu-item-arrow {
    width: 39px;
    height: 39px;

    cursor: pointer;

    transition: 200ms;
}

.aside-menu .menu .menu-item-arrow:before {
    position: absolute;
    right: 12px;
    top: 19px;

    content: '';
    width: 0;
    height: 0;

    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #ffffff;
}

.aside-menu .menu .menu-item-arrow:hover {
    background-color: #0184ba;
}
</style>


{#if visible}
<div class='aside-menu-layout' on:click={() => { dispatch('close'); }} />

<div class='aside-menu' transition:fly='{{duration: 300, x: 0}}'>
    <div class='close' on:click={() => { dispatch('close'); }} />

    {#if logo}
    <div class='logo'>
        <RouterLink to='/' title={title}>
            <img src={logo} alt={title} />
        </RouterLink>
    </div>
    {/if}

    {#if menu}
    <ul class='menu'>
        {#each menu.items as item}
            <li class='menu-item'>
                <div class='menu-item-wrapper'>
                    <div class='menu-item-link-container' on:click={() => { dispatch('close'); }}>
                        {#if isAbsLink(item.url)}
                            <a
                                href={item.url}
                                style='display: block; padding: 10px 15px 10px 15px; color: #ffffff;'
                            >
                                {item.title}
                            </a>
                        {:else}
                            <RouterLink
                                to={item.url}
                                style='display: block; padding: 10px 15px 10px 15px; color: #ffffff;'
                            >
                                {item.title}
                            </RouterLink>
                        {/if}
                    </div>

                    {#if item.items && item.items.length > 0}
                        <div class='menu-item-arrow' on:click={() => { toggleMenu(item.url); }}/>
                    {/if}
                </div>

                {#if item.items && item.items.length > 0}
                    <AsideSubMenu
                        item={item}
                        status={menuStatuses}
                        on:toggle={(evt) => { toggleMenu(evt.detail.url); }}
                    />
                {/if}
            </li>
        {/each}
    </ul>
    {/if}
</div>
{/if}
