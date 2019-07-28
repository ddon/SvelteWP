<script>
import { getContext } from 'svelte';
import { RouterView, getRoute } from '@svel/router';

import RoutingMap from '../lib/routing-map';
import { parseContent } from '../lib/yaml';

import pageStore from '../stores/page';

import { getRouting } from '../api/site';
import { getPageById } from '../api/pages';


const settings = getContext('settings');
const templates = getContext('templates');

const RequestLoader = templates['RequestLoader'];
const Header = templates['Header'];
const Footer = templates['Footer'];


let route = getRoute();
let path = '';

let routingMap = null;

let isInitialized = false;
let urlPageMap = null;
let languages = [];
let headerLanguages = [];
let menus = [];
let menu = null;
let header = {};
let footer = {};
let headerData = {};
let footerData = {};


let page = null;


function getDefaultLang(langs) {
    for (let i = 0; i < langs.length; i += 1) {
        const lang = langs[i];
        if (lang.default) {
            return lang;
        }
    }
    return null;
}


function getDefaultMenu(ms) {
    for (let i = 0; i < ms.length; i += 1) {
        const m = ms[i];
        const menuItems = m.items || [];
        for (let j = 0; j < menuItems.length; j += 1) {
            const mi = menuItems[j];
            if (mi.url === '/') {
                return m;
            }
        }
    }
    return null;
}


function getMenuBySlug(ms, slug) {
    for (let i = 0; i < ms.length; i += 1) {
        const m = ms[i];
        if (m.slug === slug) {
            return m;
        }
    }
    return null;
}


function getCurrentMenu(currentMenu) {
    const menuItems = currentMenu ? currentMenu.items : [];

    return {
        ...currentMenu,
        items: menuItems.map((item) => {
            return {
                link: routingMap.fixPath(item.url),
                name: item.title
            };
        })
    };
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

                newLanguages.push({
                    link: link,
                    name: lang.name
                });
            }
        }

        return newLanguages;
    }

    const newLanguages = [];

    for (let i = 0; i < languages.length; i += 1) {
        const lang = languages[i];

        let link = '/';
        let menuItems = [];

        const m = getMenuBySlug(menus, lang.slug);

        if (m) {
            menuItems = m.items || [];
        }

        if (menuItems.length > 0) {
            link = routingMap.fixPath(menuItems[0].url);
        }

        newLanguages.push({
            link: link,
            name: lang.name
        });
    }

    return newLanguages;
}


function updateMenuAndLanguages() {
    if (page.language) {
        const currentMenu = getMenuBySlug(menus, page.language);

        menu = getCurrentMenu(currentMenu);
        headerLanguages = getHeaderLanguages();
    } else {
        const defaultLang = getDefaultLang(languages);
        const currentMenu = getMenuBySlug(menus, defaultLang.slug);

        menu = getCurrentMenu(currentMenu);
        headerLanguages = getHeaderLanguages();
    }
}


function updateHeaderAndFooter(lang) {
    if (header.translations) {
        headerData = header.translations[lang] || {};
    }

    if (footer.translations) {
        footerData = footer.translations[lang] || {};
    }
}


function updatePage() {
    const pageId = routingMap.getPageIdByPath(path);

    if (!pageId) {
        page = null;
        pageStore.update(() => {
            return {
                isNotFound: true,
                page: null
            };
        });
        return;
    }

    getPageById(settings.apiUrl, pageId).then((res) => {
        if (res.ok) {
            page = res.data;
            pageStore.update(() => {
                return {
                    isNotFound: false,
                    page: res.data
                };
            });
        }
    });
}


function updateMultilangPage() {
    const pageId = routingMap.getPageIdByPath(path);

    if (!pageId) {
        page = null;
        pageStore.update(() => {
            return {
                isNotFound: true,
                page: null
            };
        });

        const defaultLang = getDefaultLang(languages);

        if (defaultLang) {
            const currentMenu = getMenuBySlug(menus, defaultLang.slug);
            menu = getCurrentMenu(currentMenu);
            updateHeaderAndFooter(defaultLang.slug);
        }

        headerLanguages = getHeaderLanguages();
        return;
    }

    getPageById(settings.apiUrl, pageId).then((res) => {
        if (res.ok) {
            page = res.data;
            pageStore.update(() => {
                return {
                    isNotFound: false,
                    page: res.data
                };
            });

            updateMenuAndLanguages();

            if (page && page.language) {
                updateHeaderAndFooter(page.language);
            }
        }
    });
}


function reloadRouting() {
    getRouting(settings.apiUrl).then((res) => {
        if (res.ok) {
            urlPageMap = res.data.url_page_map || {};
            languages = res.data.languages || [];
            menus = res.data.menus || [];

            if (languages.length === 0) {
                if (languages.length === 0) {
                    menu = [...menus];
                }
            } else {
                updateMenuAndLanguages();
            }
        }
    });
}


function startMonitor() {
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

                reloadRouting();

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


$: getRouting(settings.apiUrl).then((res) => {
    if (res.ok) {
        isInitialized = true;

        urlPageMap = res.data.url_page_map || {};
        languages = res.data.languages || [];
        menus = res.data.menus || [];

        const hData = res.data.header || {};
        Object.keys(hData.translations || {}).map((key) => {
            const content = hData.translations[key].content || '';
            hData.translations[key].content = parseContent(content);
        });

        const fData = res.data.footer || {};
        Object.keys(fData.translations || {}).map((key) => {
            const content = fData.translations[key].content || '';
            fData.translations[key].content = parseContent(content);
        });

        header = hData;
        footer = fData;
    }
});


startMonitor();


$: {
    if (!routingMap && urlPageMap) {
        routingMap = new RoutingMap(languages, urlPageMap);

        if (languages.length === 0) {
            menu = [...menus];
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
    <title>{settings.title}</title>
</svelte:head>

{#if isInitialized}
    <div class='app'>
        {#if Header}
            <svelte:component
                this={Header}
                languages={headerLanguages}
                menu={menu}
                data={headerData}
            />
        {/if}

        <RouterView />

        {#if Footer}
            <svelte:component
                this={Footer}
                data={footerData}
            />
        {/if}
    </div>
{:else}
    <div class='app-loader'>
        <svelte:component
            this={RequestLoader}
        />
    </div>
{/if}
