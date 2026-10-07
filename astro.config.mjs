import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://autopalvelutapsa.fi',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'ignore',
  redirects: {
    '/Kyselylomake': '/varaosakysely/',
  },
  build: {
    format: 'directory',
  },
});
