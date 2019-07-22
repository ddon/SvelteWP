<script>
import { RouterLink } from '@svel/router';

export let menu = null;


function isAbsLink(link) {
    return link && (link.indexOf('http://') === 0 || link.indexOf('https://') === 0);
}
</script>

<style>
.menus {
    flex: 1 0 auto;
    display: flex;
}

.menus .menu {
    padding: 10px 15px 10px 15px;
}
</style>

<nav class='menus'>
    {#if menu}
        {#each menu.items as item}
            <div class='menu'>
                {#if isAbsLink(item.link)}
                    <a href={item.link}>{item.name}</a>
                {:else}
                    <RouterLink to={item.link}>
                        {item.name}
                    </RouterLink>
                {/if}
            </div>
        {/each}
    {/if}
</nav>
