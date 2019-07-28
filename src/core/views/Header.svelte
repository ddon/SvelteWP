<script>
import Menu from '../components/Menu.svelte';
import LanguageSwitcher from '../components/LanguageSwitcher.svelte';

export let languages = [];
export let menu = null;

export let data = {};
</script>

<style>
.header {
    display: flex;
    background-color: #eee;
    padding: 10px;
}

.header .title {
    padding: 10px 15px 10px 15px;
    font-weight: 600;
}
</style>


<header class='header'>
    {#if data.title}
        <div class='title'>{data.title}</div>
    {/if}

    <Menu menu={menu} />
    <LanguageSwitcher languages={languages} />
</header>
