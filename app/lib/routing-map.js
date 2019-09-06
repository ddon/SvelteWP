
export default class RoutingMap {
    constructor(urlPageMap) {
        this.map = {};

        Object.keys(urlPageMap).forEach((url) => {
            const link = decodeURI(url);
            const data = urlPageMap[url];

            this.map[link] = {
                pageId: parseInt(data.page_id, 10)
            };
        });
    }

    getPageIdByPath(path) {
        const pagePath = decodeURI(path);

        if (this.map[pagePath]) {
            return this.map[pagePath].pageId;
        }

        return null;
    }

    getPathByPageId(pageId) {
        const paths = Object.keys(this.map);

        for (let i = 0; i < paths.length; i += 1) {
            const path = paths[i];
            if (pageId === this.map[path].pageId) {
                return path;
            }
        }

        return '/';
    }
}
