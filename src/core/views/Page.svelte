<script>
import { getContext } from 'svelte';
import { fade } from 'svelte/transition';
import { getRoute } from '@svel/router';
import jsyaml from 'js-yaml';

import pageStore from '../stores/page';


let templates = getContext('templates');

let isNotFound = false;
let page = null;
let templateComponent = null;
let templateData = null;


const unsubscribe = pageStore.subscribe(value => {
    isNotFound = value.isNotFound;
    page = value.page;
});


function deleteTags(content) {
    const regex = /(<([^>]+)>)/ig;
    return content.replace(regex, '');
}

function parseContent(content) {
    let txt = deleteTags(content).trim();

    try {
        return jsyaml.load(txt);
    } catch (e) {
        console.log(txt);
        console.log(e);
        return {};
    }
}

$: {
    if (page) {
        templateComponent = null;
        templateData = null;

        const pageContent = page.content.rendered || '';
        const yaml = parseContent(pageContent);

        if (yaml && templates[yaml.template]) {
            templateComponent = templates[yaml.template];
            templateData = yaml;
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
            <svelte:component this={templateComponent} data={templateData} />
        </div>
    {:else}
        {@html page.content.rendered}
    {/if}
{:else if isNotFound}
    <svelte:component this={templates.NotFound} />
{/if}
</div>
