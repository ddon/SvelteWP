import { get } from './../lib/net';


export function getVersion() {
    return get(`/bundle.version.json`);
}


export function getInit(apiUrl) {
    return get(`${apiUrl}/wp-json/svelte-wp/v1/site/init`);
}
