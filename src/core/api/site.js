import { get } from './../lib/net';


export function getInit(apiUrl) {
    return get(`${apiUrl}/wp-json/svelte-wp/v1/init`);
}
