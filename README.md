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
