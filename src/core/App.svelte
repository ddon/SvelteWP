<script>
import { setContext } from 'svelte';
import { HistoryRouter, RouterProvider, RouterView } from '@svel/router';

import RequestLoader from './components/RequestLoader.svelte';

import Layout from './views/Layout.svelte';
import Header from './views/Header.svelte';
import Footer from './views/Footer.svelte';
import Page from './views/Page.svelte';
import NotFound from './views/NotFound.svelte';


// TODO: this is router fix, delete this after router updated
window.process = {
    env: {
        'NODE_ENV': 'production'
    }
};


export let settings = {};
export let templates = {};

setContext('settings', {
    title: '',
    apiUrl: '',
    ...settings
});

setContext('templates', {
    'RequestLoader': RequestLoader,
    'Header': Header,
    'Footer': Footer,
    'NotFound': NotFound,
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
