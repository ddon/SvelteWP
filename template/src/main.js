import SvelteWP from 'svelte-wp';

import settings from './settings';
import templates from './templates';


const app = new SvelteWP({
    target: document.body,
    props: {
        version: VERSION,
        settings: settings,
        templates: templates
    }
});

export default app;
