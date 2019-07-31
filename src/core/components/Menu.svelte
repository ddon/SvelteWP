<script>
import { RouterLink } from '@svel/router';

import SubMenu from './SubMenu.svelte';

import { isAbsLink } from './../lib/links';


export let menu = null;


function getMenuClasses(item) {
    const classes = ['menu-item'];

    if (item.items && item.items.length > 0) {
        classes.push('menu-item-with-menu');
    }

    return classes.join(' ');
}
</script>

<style>
.menus {
    flex: 1 0 auto;
    display: flex;
}

.menus .menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

.menus .menu .menu-item {
    padding: 10px 15px 10px 15px;
    cursor: pointer;
    position: relative;

    transition: 200ms;
    transition-delay: 200ms;
}

.menus .menu .menu-item:hover {
    background-color: #ddd;
    transition-delay: 0ms;
}

.menus .menu .menu-item-with-menu {
    padding-right: 20px;
}

.menus .menu .menu-item-with-menu::before {
    content: '';
    width: 0;
    height: 0;

    position: absolute;
    right: 5px;
    top: 50%;

    transform: translateY(-50%);

    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #000;
}
</style>


<nav class='menus'>
    {#if menu}
        <ul class='menu'>
            {#each menu.items as item}
                <li class={getMenuClasses(item)}>
                    {#if isAbsLink(item.link)}
                        <a href={item.link}>{item.name}</a>
                    {:else}
                        <RouterLink to={item.link}>
                            {item.name}
                        </RouterLink>
                    {/if}
                    <SubMenu item={item} />
                </li>
            {/each}
        </ul>
    {/if}
</nav>
