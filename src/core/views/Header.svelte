<script>
import { RouterLink } from '@svel/router';

import Menu from '../components/Menu.svelte';
import LanguageSwitcher from '../components/LanguageSwitcher.svelte';

export let languages = [];
export let menu = null;
export let logo = '';
export let title = '';

export let data = {};
</script>

<style>
.header {
    display: flex;
    background-color: #eee;
    padding: 5px;
}

.header .logo {
    margin: auto;
}

.header .logo img {
    max-width: 160px;
    display: block;
}
</style>


<header class='header'>
    {#if logo}
        <div class="logo">
            <RouterLink to='/' title={title}>
                <img src={logo} alt="{title} logo" />
            </RouterLink>
        </div>
    {/if}
    <Menu menu={menu} />
    <LanguageSwitcher languages={languages} dropdown={true} />
</header>
