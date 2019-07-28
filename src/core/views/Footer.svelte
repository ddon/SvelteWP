<script>
export let data = {};
</script>

<style>
.footer {
    display: flex;
    background-color: #eee;
    padding: 15px;
}
</style>


<footer class='footer'>
    {#if data.content && data.content.copyright}
        <div>{data.content.copyright}</div>
    {/if}
</footer>
