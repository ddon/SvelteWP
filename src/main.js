import { App } from './core';

import settings from './settings';
import templates from './templates';


const app = new App({
    target: document.body,
    props: {
        version: VERSION,
        settings: settings,
        templates: templates
    }
});

export default app;
