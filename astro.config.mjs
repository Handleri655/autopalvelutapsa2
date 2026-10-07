import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://autopalvelutapsa.fi',
  trailingSlash: 'ignore',
  redirects: {
    '/Kyselylomake': '/varaosakysely/',
  },
  build: {
    format: 'directory',
  },
});
