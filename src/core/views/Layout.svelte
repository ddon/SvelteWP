<script>
import { getContext } from 'svelte';
import { RouterView, getRoute } from '@svel/router';

import LocalStorageWrapper from '../lib/local-storage-wrapper';
import RoutingMap from '../lib/routing-map';
import { startMonitor } from '../lib/monitor';

import pageStore from '../stores/page';

import { getVersion, getInit } from '../api/site';
import { getPageById } from '../api/pages';


const version = getContext('version');
const settings = getContext('settings');
const templates = getContext('templates');


const defaultMenus = {
    header: {},
    footer: {}
};

const defaultLanguages = {
    items: [],
    language_switcher_settings: {
        header: {},
        footer: {}
    }
};

let route = getRoute();
let path = '';

const cache = new LocalStorageWrapper();
let routingMap = null;

let isLastVersion = true;
let lastVersion = '';

let isInitialized = false;
let title = '';
let logo = '';
let urlPageMap = null;
let languages = { ...defaultLanguages };

let menus = { ...defaultMenus };
let menu = null;

let header = {};
let headerLanguages = [];
let headerData = {};

let footer = {};
let footerMenu = {};
let footerData = {};

let page = null;
let isNetworkError = false;


function getDefaultLang(langs) {
    for (let i = 0; i < langs.items.length; i += 1) {
        const lang = langs.items[i];
        if (lang.default) {
            return lang;
        }
    }
    return null;
}


function getHeaderLanguages() {
    if (!page) {
        const newLangs = [];

        for (let i = 0; i < languages.items.length; i += 1) {
            const lang = languages.items[i];

            newLangs.push({
                ...lang,
                link: lang.default_url
            });
        }

        return newLangs;
    }

    const newLanguages = [];

    for (let i = 0; i < languages.items.length; i += 1) {
        const lang = languages.items[i];
        let link = '/';

        if (page.language) {
            const translationsKeys = Object.keys(page.translations);

            if (translationsKeys.indexOf(lang.slug) !== -1) {
                for (let j = 0; j < translationsKeys.length; j += 1) {
                    const pageSlug = translationsKeys[j];
                    const pageId = page.translations[pageSlug];

                    if (page.id === pageId) {
                        continue;
                    }

                    if (pageSlug === lang.slug) {
                        link = routingMap.getPathByPageId(pageId);
                        break;
                    }
                }
            } else {
                continue;
            }
        }

        if (link === '/') {
            link = lang.default_url;
        }

        newLanguages.push({
            ...lang,
            link: link
        });
    }

    return newLanguages;
}


function updateInitData(res) {
    isInitialized = true;

    title = res.data.site_title || '';
    logo = res.data.site_logo || '';
    urlPageMap = res.data.url_page_map || {};
    languages = res.data.languages || { ...defaultLanguages };
    menus = res.data.menus || { ...defaultMenus };

    header = res.data.header || { translations: {} };
    footer = res.data.footer || { translations: {} };
}


function updateMenuAndLanguages() {
    if (page.language) {
        menu = menus.header[page.language];
        headerLanguages = getHeaderLanguages();
        headerData = header.translations[page.language];
        footerMenu = menus.footer[page.language];
        footerData = footer.translations[page.language];
    } else {
        const defaultLang = getDefaultLang(languages);

        menu = menus.header[defaultLang.slug];
        headerLanguages = getHeaderLanguages();
        headerData = header.translations[defaultLang.slug];
        footerMenu = menus.footer[defaultLang.slug];
        footerData = footer.translations[defaultLang.slug];
    }
}


function updatePage() {
    const pageId = routingMap.getPageIdByPath(path);

    if (!pageId) {
        page = null;
        pageStore.update((val) => {
            val.isNotFound = true;
            val.page = null;
            return val;
        });
        return;
    }

    const cachedPage = cache.getPageById(pageId);

    if (cachedPage) {
        page = cachedPage;
        isNetworkError = false;
        pageStore.update((val) => {
            val.isNotFound = false;
            val.isNetworkError = false;
            val.page = cachedPage;
            return val;
        });
    }

    getPageById(settings.apiUrl, pageId).then((res) => {
        if (res.ok) {
            page = res.data;
            pageStore.update((val) => {
                val.isNotFound = false;
                val.page = res.data;
                return val;
            });

            cache.setPageById(page);
        }
    }).catch((err) => {
        console.error(err);

        const p = cache.getPageById(pageId);

        if (p) {
            page = p;
            isNetworkError = true;
            pageStore.update((val) => {
                val.isNotFound = false;
                val.isNetworkError = true;
                val.page = p;
                return val;
            });
        } else {
            page = null;
            isNetworkError = true;
            pageStore.update((val) => {
                val.isNotFound = true;
                val.isNetworkError = true;
                val.page = null;
                return val;
            });
        }
    });
}


function updateMultilangPage() {
    const pageId = routingMap.getPageIdByPath(path);

    if (!pageId) {
        page = null;
        pageStore.update((val) => {
            val.isNotFound = true;
            val.page = null;
            return val;
        });

        const defaultLang = getDefaultLang(languages);

        if (defaultLang) {
            menu = menus.header[defaultLang.slug];
            headerData = header.translations[defaultLang.slug];
            footerMenu = menus.footer[defaultLang.slug];
            footerData = footer.translations[defaultLang.slug];
        }

        headerLanguages = getHeaderLanguages();
        return;
    }

    const cachedPage = cache.getPageById(pageId);

    if (cachedPage) {
        page = cachedPage;
        isNetworkError = false;
        pageStore.update((val) => {
            val.isNotFound = false;
            val.isNetworkError = false;
            val.page = cachedPage;
            return val;
        });
    }

    getPageById(settings.apiUrl, pageId).then((res) => {
        if (res.ok) {
            page = res.data;
            isNetworkError = false;
            pageStore.update((val) => {
                val.isNotFound = false;
                val.isNetworkError = false;
                val.page = res.data;
                return val;
            });

            cache.setPageById(page);

            updateMenuAndLanguages();
        }
    }).catch((err) => {
        console.error(err);

        const p = cache.getPageById(pageId);

        if (p) {
            page = p;
            isNetworkError = true;
            pageStore.update((val) => {
                val.isNotFound = false;
                val.isNetworkError = true;
                val.page = p;
                return val;
            });
        } else {
            page = null;
            isNetworkError = true;
            pageStore.update((val) => {
                val.isNotFound = true;
                val.isNetworkError = true;
                val.page = null;
                return val;
            });
        }
    });
}


function updateRouting() {
    getInit(settings.apiUrl).then((res) => {
        if (res.ok) {
            updateInitData(res);

            if (languages.items.length === 0) {
                menu = { ...menu.header };
            } else {
                updateMenuAndLanguages();
            }
        }
    });
}


function tryReloadPage() {
    if (languages.items.length === 0) {
        updatePage();
    } else {
        updateMultilangPage();
    }
}


function startVersionMonitor() {
    getVersion().then((res) => {
        if (res.version !== version) {
            console.log('[VersionMonitor] version changed from', version, 'to', res.version);

            isLastVersion = false;
            lastVersion = res.version;
        }
    });

    startMonitor(() => {
        getVersion().then((res) => {
            if (res.version !== version) {
                console.log('[VersionMonitor] version changed from', version, 'to', res.version);

                isLastVersion = false;
                lastVersion = res.version;
            }
        });
    });
}


function startUpdateMonitor() {
    if (!settings.pubnubEnabled) {
        return;
    }

    if (!window.PubNub) {
        console.log('window.PubNub is not defined');
        return;
    }

    const pubnub = new window.PubNub({
        publishKey: settings.pubnubPublishKey,
        subscribeKey: settings.pubnubSubscribeKey
    });

    pubnub.subscribe({
        channels: ['wordpress']
    });

    pubnub.addListener({
        message: (msg) => {
            if (msg && msg.message) {
                const { post_id: postId } = msg.message;

                updateRouting();

                const pageId = routingMap.getPageIdByPath(path);

                if (pageId && pageId === postId) {
                    if (languages.items.length === 0) {
                        updatePage();
                    } else {
                        updateMultilangPage();
                    }
                }
            }
        }
    });
}

startVersionMonitor();
startUpdateMonitor();


$: getInit(settings.apiUrl).then((res) => {
    if (res.ok) {
        updateInitData(res);
    }
});


$: {
    if (!routingMap && urlPageMap) {
        routingMap = new RoutingMap(urlPageMap);

        if (languages.items.length === 0) {
            menu = { ...menus.header };
        }
    }

    if (routingMap && path !== $route.path) {
        path = $route.path;

        if (languages.items.length === 0) {
            updatePage();
        } else {
            updateMultilangPage();
        }
    }
}
</script>

<style>
.app-loader {
    display: flex;
    justify-content: center;
}

.app {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>


<svelte:head>
    <title>
        {(page && page.title) ? `${page.title} - ` : ''}
        {title}
    </title>
</svelte:head>

{#if isInitialized}
    <div class='app'>
        <svelte:component
            this={templates.Header}
            languages={headerLanguages}
            currentLanguage={page ? page.language : ''}
            isLanguagesDropdown={(languages.language_switcher_settings.header {}).as_dropdown}
            menu={menu}
            logo={logo}
            title={title}
            data={headerData}
        />

        {#if isNetworkError}
            <svelte:component
                this={templates.NetworkError}
                on:reload={tryReloadPage}
            />
        {/if}

        <RouterView />

        {#if !isLastVersion}
            <svelte:component
                this={templates.NewVersion}
                version={lastVersion}
            />
        {/if}

        <svelte:component
            this={templates.Footer}
            menu={footerMenu}
            data={footerData}
        />
    </div>
{:else}
    <div class='app-loader'>
        <svelte:component
            this={templates.RequestLoader}
        />
    </div>
{/if}
