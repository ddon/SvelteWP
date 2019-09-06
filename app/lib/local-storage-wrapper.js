
export default class LocalStorageWrapper {
    setPageById(page) {
        const keyName = `page${page.page_id}`;
        localStorage.setItem(keyName, JSON.stringify(page));
    }

    getPageById(pageId) {
        const keyName = `page${pageId}`;
        const item = localStorage.getItem(keyName);

        try {
            return JSON.parse(item);
        } catch (err) {
            return null;
        }
    }
}
