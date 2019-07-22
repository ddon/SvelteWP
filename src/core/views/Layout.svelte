<script>
import { getContext } from 'svelte';
import { RouterView, getRoute } from '@svel/router';

import pageStore from '../stores/page';

import { getRouting } from '../api/site';
import { getPageById } from '../api/pages';

import RoutingMap from '../lib/routing-map';


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


function setCurrentMenu(currentMenu) {
    const menuItems = currentMenu ? currentMenu.items : [];

    menu = {
        ...currentMenu,
        items: menuItems.map((item) => {
            return {
                link: routingMap.fixPath(item.url),
                name: item.title
            };
        })
    };
}

function setHeaderLanguages() {
    if (page) {
        const newLanguages = [];

        for (let i = 0; i < languages.length; i += 1) {
            const lang = languages[i];
            let link = '/';

            if (page.polylang_translations) {
                for (let j = 0; j < page.polylang_translations.length; j += 1) {
                    const p = page.polylang_translations[j];

                    if (page.id === p.id) {
                        continue;
                    }

                    const localeSegs = p.locale.split('_');

                    if (localeSegs.length > 0 && localeSegs[0] === lang.slug) {
                        link = routingMap.getPathByPageId(p.id);
                        break;
                    }
                }

                newLanguages.push({
                    link: link,
                    name: lang.name
                });
            }
        }

        headerLanguages = [...newLanguages];
    } else {
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

        headerLanguages = [...newLanguages];
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
        page = res;
        pageStore.update(() => {
            return {
                isNotFound: false,
                page: res
            };
        });
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
            setCurrentMenu(currentMenu);
        }

        setHeaderLanguages();
        return;
    }

    getPageById(settings.apiUrl, pageId).then((res) => {
        page = res;
        pageStore.update(() => {
            return {
                isNotFound: false,
                page: res
            };
        });

        if (page.polylang_current_lang) {
            const pageLocale = page.polylang_current_lang;
            const langSlug = pageLocale.split('_')[0];
            const currentMenu = getMenuBySlug(menus, langSlug);

            setCurrentMenu(currentMenu);
            setHeaderLanguages();
        } else {
            const defaultLang = getDefaultLang(languages);
            const currentMenu = getMenuBySlug(menus, defaultLang.slug);

            setCurrentMenu(currentMenu);
            setHeaderLanguages();
        }
    });
}


$: getRouting(settings.apiUrl).then((res) => {
    if (res.ok) {
        isInitialized = true;

        urlPageMap = res.data.url_page_map || {};
        languages = res.data.languages || [];
        menus = res.data.menus || [];
    }
});


$: {
    if (!routingMap && urlPageMap) {
        routingMap = new RoutingMap(languages, urlPageMap);

        if (languages.length === 0) {
            const currentMenu = getDefaultMenu(menus);
            if (currentMenu) {
                setCurrentMenu(currentMenu);
            }
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
:global(body) {
    padding: 0;
}

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
            />
        {/if}

        <RouterView />

        {#if Footer}
            <svelte:component this={Footer} />
        {/if}
    </div>
{:else}
    <div class='app-loader'>
        <svelte:component
            this={RequestLoader}
        />
    </div>
{/if}
