import { get } from './../lib/net';


export function getPageById(apiUrl, pageId) {
    return get(`${apiUrl}/wp-json/svelte-wp/v1/page/${pageId}`);
}


export function getPrecachedPages(apiUrl, langSlug = '') {
    return get(`${apiUrl}/wp-json/svelte-wp/v1/precached-pages/${langSlug}`);
}
