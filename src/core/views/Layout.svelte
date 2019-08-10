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

let route = getRoute();
let path = '';

const cache = new LocalStorageWrapper();
let routingMap = null;

let isLastVersion = true;
let lastVersion = '';

let isInitialized = false;
let title = '';
let urlPageMap = null;
let languages = [];
let menus = { ...defaultMenus };
let logo = '';

let menu = null;
let headerLanguages = [];
let header = {};
let footer = {};

let page = null;
let isNetworkError = false;


function getDefaultLang(langs) {
    for (let i = 0; i < langs.length; i += 1) {
        const lang = langs[i];
        if (lang.default) {
            return lang;
        }
    }
    return null;
}


function getHeaderLanguages() {
    if (page) {
        const newLanguages = [];

        for (let i = 0; i < languages.length; i += 1) {
            const lang = languages[i];
            let link = '/';

            if (page.language) {
                const translationsKeys = Object.keys(page.translations);

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
            }

            newLanguages.push({
                slug: lang.slug,
                link: link,
                name: lang.name,
                default: lang.default
            });
        }

        return newLanguages;
    }

    const newLanguages = [];

    for (let i = 0; i < languages.length; i += 1) {
        const lang = languages[i];

        let link = '/';
        let menuItems = [];

        const m = menus.header[lang.slug];

        if (m) {
            menuItems = m.items || [];
        }

        if (menuItems.length > 0) {
            link = menuItems[0].url;
        }

        newLanguages.push({
            slug: lang.slug,
            link: link,
            name: lang.name,
            default: lang.default
        });
    }

    return newLanguages;
}


function updateMenuAndLanguages() {
    if (page.language) {
        menu = menus.header[page.language];
        headerLanguages = getHeaderLanguages();
        footer = menus.footer[page.language] || {};
    } else {
        const defaultLang = getDefaultLang(languages);

        menu = menus.header[defaultLang.slug];
        headerLanguages = getHeaderLanguages();
        footer = menus.footer[defaultLang] || {};
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
            footer = menus.footer[defaultLang.slug];
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
    }).catch(() => {
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
            title = res.data.site_title || '';
            urlPageMap = res.data.url_page_map || {};
            languages = res.data.languages || [];
            menus = res.data.menus || { ...defaultMenus };
            logo = res.data.site_logo || '';

            if (languages.length === 0) {
                if (languages.length === 0) {
                    menu = { ...menu.header };
                }
            } else {
                updateMenuAndLanguages();
            }
        }
    });
}


function tryReloadPage() {
    if (languages.length === 0) {
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
                    if (languages.length === 0) {
                        updatePage();
                    } else {
                        updateMultilangPage();
                    }
                }
            }
        }
    });
}


$: getInit(settings.apiUrl).then((res) => {
    if (res.ok) {
        isInitialized = true;

        title = res.data.site_title || '';
        urlPageMap = res.data.url_page_map || {};
        languages = res.data.languages || [];
        menus = res.data.menus || { ...defaultMenus };
        logo = res.data.site_logo || '';
    }
});


startVersionMonitor();
startUpdateMonitor();


$: {
    if (!routingMap && urlPageMap) {
        routingMap = new RoutingMap(urlPageMap);

        if (languages.length === 0) {
            menu = { ...menus.header };
        }
    }

    if (routingMap && path !== $route.path) {
        path = $route.path;

        if (languages.length === 0) {
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
            menu={menu}
            logo={logo}
            title={title}
            data={header}
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
            data={footer}
        />
    </div>
{:else}
    <div class='app-loader'>
        <svelte:component
            this={templates.RequestLoader}
        />
    </div>
{/if}
