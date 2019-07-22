import { get } from './../lib/net';


export function getPageById(apiUrl, pageId) {
    return get(`${apiUrl}/wp-json/wp/v2/pages/${pageId}`);
}
