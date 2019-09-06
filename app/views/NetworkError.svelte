<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
</script>

<style>
.network-error {
    position: fixed;
    top: 45px;

    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.network-error .network-message {
    padding: 15px 20px 15px 20px;

    color: #f23136;
    text-align: center;

    background-color: rgb(238, 238, 238);
    border: 1px solid #cccccc;
    border-radius: 2px;
}

.network-error .reload-message {
    margin: 10px 0 0 0;
    color: rgb(0, 0, 255);
    font-weight: 600;
    cursor: pointer;
}

.network-error .reload-message:hover {
    color: rgb(0, 0, 204);
}
</style>


<div class='network-error'>
    <div class='network-message'>
        <div>Ops! Please check your network connection!</div>
        <div class='reload-message' on:click={() => { dispatch('reload'); }}>
            Try reload page
        </div>
    </div>
</div>
