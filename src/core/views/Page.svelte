<script>
import { getContext } from 'svelte';
import { fade } from 'svelte/transition';
import { getRoute } from '@svel/router';

import menuStore from '../stores/menu';
import pageStore from '../stores/page';

import { getText } from '../lib/object-props';


let templates = getContext('templates');

let isNotFound = false;
let isNetworkError = false;
let page = null;
let templateComponent = null;
let templateData = null;
let menu = null;


menuStore.subscribe(value => {
    menu = value.menu;
});

pageStore.subscribe(value => {
    isNotFound = value.isNotFound;
    isNetworkError = value.isNetworkError;
    page = value.page;
});


$: {
    if (page) {
        templateComponent = null;
        templateData = null;

        const pageContent = page.content || {};

        if (templates[pageContent.template]) {
            templateComponent = templates[pageContent.template];
            templateData = pageContent;
        }
    }
}
</script>


<style>
.page {
    flex: 1 0 auto;
}
</style>


<div class='page'>
{#if page}
    {#if templateComponent}
        <div transition:fade='{{ delay: 250, duration: 300 }}'>
            <svelte:component
                this={templateComponent}
                menu={menu}
                data={templateData}
                text={getText(templateData)}
            />
        </div>
    {:else}
        <div transition:fade='{{ delay: 250, duration: 300 }}'>
            {@html page.content}
        </div>
    {/if}
{:else if isNotFound && !isNetworkError}
    <svelte:component this={templates.NotFound} />
{/if}
</div>
