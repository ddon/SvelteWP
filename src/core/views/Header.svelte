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
}
</style>


<header class='header'>
    <Menu menu={menu} />
    <LanguageSwitcher languages={languages} />
</header>
