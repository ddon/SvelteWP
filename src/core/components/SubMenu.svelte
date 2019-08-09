<script>
import { RouterLink } from '@svel/router';

import { isAbsLink } from './../lib/links';


export let item = null;


function getMenuItemClasses(item) {
    const classes = ['menu-item'];

    if (item && item.items.length > 0) {
        classes.push('menu-item-with-submenu');
    }

    return classes.join(' ');
}
</script>


<style>
.sub-menu {
    list-style: none;
    padding: 0;
    margin: 0;

    visibility: hidden;
    opacity: 0;
    z-index: 100;

    position: absolute;
    top: 50px;
    left: 0;

    min-width: 160px;

    background-color: #0178a9;
    transition: 200ms;
    transition-delay: 200ms;
}

.sub-menu .menu-item {
    padding: 10px 15px 10px 15px;
    cursor: pointer;
    position: relative;

    transition: 200ms;
    transition-delay: 200ms;
}

.sub-menu .menu-item-with-submenu::before {
    content: '';
    width: 0;
    height: 0;

    position: absolute;
    right: 8px;
    top: 50%;

    transform: translateY(-50%);

    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid #000;
}

.sub-menu .menu-item:hover {
    background-color: #0190ca;
}

.menu-item:hover > ul {
    visibility: visible;
    opacity: 1;
}
</style>


{#if item && item.items && item.items.length > 0}
    <ul class='sub-menu'>
        {#each item.items as item}
            <li class={getMenuItemClasses(item)}>
                {#if isAbsLink(item.url)}
                    <a href={item.url} style='color: #ffffff;'>
                        {item.title}
                    </a>
                {:else}
                    <RouterLink to={item.url} style='color: #ffffff;'>
                        {item.title}
                    </RouterLink>
                {/if}
                {#if item.items && item.items.length > 0}
                    <svelte:self item={item} />
                {/if}
            </li>
        {/each}
    </ul>
{/if}

