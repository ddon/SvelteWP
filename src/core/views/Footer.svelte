<script>
import { RouterLink } from '@svel/router';

import { isAbsLink } from './../lib/links';


export let data = {};
</script>

<style>
.footer {
    display: flex;
    background-color: #016087;
}

.footer .footer-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

.footer .footer-menu .footer-menu-item {
    padding: 10px 15px 10px 15px;
}
</style>


<footer class='footer'>
    {#if data.items && data.items.length > 0}
        <ul class='footer-menu'>
            {#each data.items as item}
                <li class='footer-menu-item'>
                    {#if isAbsLink(item.url)}
                        <a href={item.link} style='color: #ffffff;'>
                            {item.title}
                        </a>
                    {:else}
                        <RouterLink to={item.url} style='color: #ffffff;'>
                            {item.title}
                        </RouterLink>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</footer>
