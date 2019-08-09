<script>
import { createEventDispatcher } from 'svelte';

import { RouterLink } from '@svel/router';

import { isAbsLink } from './../lib/links';


const dispatch = createEventDispatcher();

export let item = null;
export let status = {};
</script>


<style>
.aside-sub-menu {
    list-style: none;
    padding: 0;
    margin: 0;

    z-index: 100;

    width: 100%;

    background-color: #0178a9;
    border-bottom: 1px solid #002433;
    transition: 200ms;
}

.aside-sub-menu .aside-menu-item {
    position: relative;
    display: flex;
    cursor: pointer;

    transition: 200ms;
}

.aside-sub-menu > ul {
    background-color: #0184ba;
}

.aside-sub-menu .aside-menu-item:hover {
    background-color: #0184ba;
}

.aside-sub-menu .aside-menu-item-link-container {
    flex: 1 0 auto;
}

.aside-sub-menu .aside-menu-item-arrow {
    width: 39px;
    height: 39px;

    cursor: pointer;

    transition: 200ms;
}

.aside-sub-menu .aside-menu-item-arrow::before {
    position: absolute;
    right: 12px;
    top: 50%;

    content: '';
    width: 0;
    height: 0;

    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #ffffff;
}

.aside-sub-menu .aside-menu-item-arrow:hover {
    background-color: #0184ba;
}
</style>


{#if item && item.items && item.items.length > 0 && status[item.url]}
    <ul class='aside-sub-menu'>
        {#each item.items as item}
            <li class='aside-menu-item'>
                <div class='aside-menu-item-link-container' on:click={() => { dispatch('toggle', { url: item.url }); }}>
                    {#if isAbsLink(item.url)}
                        <a href={item.url} style='display: block; color: #ffffff; padding: 10px 15px 10px 15px;'>
                            {item.title}
                        </a>
                    {:else}
                        <RouterLink to={item.url} style='display: block; color: #ffffff; padding: 10px 15px 10px 15px;'>
                            {item.title}
                        </RouterLink>
                    {/if}
                </div>

                {#if item.items && item.items.length > 0}
                    <div class='aside-menu-item-arrow' on:click={() => { console.log(item.url); dispatch('toggle', { url: item.url }); }}/>
                {/if}
            </li>

            {#if item.items && item.items.length > 0}
                <svelte:self
                    item={item}
                    status={status}
                    on:toggle={(evt) => { dispatch('toggle', evt.detail); }}
                 />
            {/if}
        {/each}
    </ul>
{/if}

