⚠️ BEWARE: Experimental. Just for preview. Installation and usage will change.

This project is an experiment to use Svelte (https://svelte.dev/) with WordPress (https://wordpress.org/).

# SvelteWP


```bash
npm i
npm run build
```


# Settings

**src/settings.js**

```js
export default {
    apiUrl: 'https://example.com'
};
```


# Templates

```bash
mkdir src/templates
```

**src/templates/Home.svelte**

```
<h1>Home</h1>
```


**src/templates/index.js**

```
import Home from './Home.svelte';


export default {
    'Home': Home
};
```
