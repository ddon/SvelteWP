<script>
import { setContext } from 'svelte';
import { HistoryRouter, RouterProvider, RouterView } from '@svel/router';

import RequestLoader from './components/RequestLoader.svelte';

import Layout from './views/Layout.svelte';
import Header from './views/Header.svelte';
import Footer from './views/Footer.svelte';
import Page from './views/Page.svelte';

import NotFound from './views/NotFound.svelte';
import NetworkError from './views/NetworkError.svelte';
import NewVersion from './views/NewVersion.svelte';


// TODO: this is router fix, delete this after router updated
window.process = {
    env: {
        'NODE_ENV': 'production'
    }
};


const defaultSettings = {
    apiUrl: ''
};


const defaultTemplates = {
    RequestLoader,
    Header,
    Footer,
    NotFound,
    NetworkError,
    NewVersion
};


export let version = '';
export let settings = {};
export let templates = {};


setContext('version', version);

setContext('settings', {
    ...defaultSettings,
    ...settings
});

setContext('templates', {
    ...defaultTemplates,
    ...templates
});


const router = new HistoryRouter({
    base: '/',
    routes: [
        {
            path: '/',
            component: Layout,
            children: [
                { path: '', component: Page },
                { path: '*', component: Page }
            ]
        }
    ]
});
</script>

<RouterProvider {router}>
    <RouterView />
</RouterProvider>
