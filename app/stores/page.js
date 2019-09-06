import { writable } from 'svelte/store';


export default writable({
    isNotFound: false,
    isNetworkError: false,
    page: null
});
