
export default class RoutingMap {
    constructor(languages, urlPageMap) {
        this.map = {};
        this.langPrefixes = [];

        for (let i = 0; i < languages.length; i += 1) {
            const lang = languages[i];
            this.langPrefixes.push(`/${lang.slug}/`);
        }

        Object.keys(urlPageMap).forEach((url) => {
            let link = decodeURI(url);
            const linkPrefix = this.getPrefixByPath(link);

            if (linkPrefix) {
                link = link.slice(linkPrefix.length - 1);
            }

            const data = urlPageMap[url];
            this.map[link] = {
                pageId: parseInt(data.page_id, 10)
            };
        });
    }

    getPrefixByPath(path) {
        for (let i = 0; i < this.langPrefixes.length; i += 1) {
            const prefix = this.langPrefixes[i];
            if (path.indexOf(prefix) === 0) {
                return prefix;
            }
        }
        return '';
    }

    getPageIdByPath(path) {
        const prefix = this.getPrefixByPath(path);
        let pagePath = decodeURI(path);

        if (prefix) {
            pagePath = pagePath.slice(prefix.length - 1);
        }

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
                return this.fixPath(path);
            }
        }

        return '/';
    }

    fixPath(path) {
        const prefix = this.getPrefixByPath(path);

        if (!prefix) {
            return path;
        }

        return path.slice(prefix.length - 1);
    }
}
