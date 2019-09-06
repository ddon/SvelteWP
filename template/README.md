# SvelteWP

⚠️ BEWARE: Experimental. Just for preview. Installation and usage will change.

This project is an experiment to use [Svelte](https://svelte.dev/) with [WordPress](https://wordpress.org/).

On WordPress side you will need to install WordPress [SvelteWP Plugin](https://github.com/ddon/SvelteWP-plugin).


## Installation

```bash
npm install
```


## Settings

**src/settings.js**

```js
export default {
    apiUrl: 'https://example.com'
};
```


## Development

```bash
npm run dev
```


## Build

```bash
npm run build
```


## Custom templates

```js
import Header from './Header.svelte';
import Footer from './Footer.svelte';
import CustomLeftMenu from './CustomLeftMenu.svelte';

import Home from './Home.svelte';


export default {
    Header,
    Footer,
    CustomLeftMenu,

    Home
};
```


## Nginx

```nginx
# -*- mode: nginx -*-

server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        return 301 https://$server_name$request_uri;
    }

    location ~ /\.well-known {
        root /www/certbot;
    }
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    root /path/to/public;
    index index.php index.html;

    access_log  /var/log/nginx/example.com.access.log;
    error_log   /var/log/nginx/example.com.error.log;

    ssl_certificate     /etc/nginx/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com/privkey.pem;

    location / {
        try_files $uri /index.html;
    }
}
```
