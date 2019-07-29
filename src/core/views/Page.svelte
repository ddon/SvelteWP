<script>
import { getContext } from 'svelte';
import { fade } from 'svelte/transition';
import { getRoute } from '@svel/router';

import pageStore from '../stores/page';

import { getText } from '../lib/object-props';


let templates = getContext('templates');

let isNotFound = false;
let page = null;
let templateComponent = null;
let templateData = null;


const unsubscribe = pageStore.subscribe(value => {
    isNotFound = value.isNotFound;
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
        <div in:fade="{{ delay: 250, duration: 300 }}">
            <svelte:component
                this={templateComponent}
                data={templateData}
                text={getText(templateData)}
            />
        </div>
    {:else}
        {@html page.content}
    {/if}
{:else if isNotFound}
    <svelte:component this={templates.NotFound} />
{/if}
</div>
