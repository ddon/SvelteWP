import { get } from './../lib/net';


export function getRouting(apiUrl) {
    return get(`${apiUrl}/wp-json/svelte-wp/v1/routing`);
}
