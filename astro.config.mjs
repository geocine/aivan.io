import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

// https://astro.build/config
export default defineConfig({
  site: 'https://aivan.io',
  publicDir: './static',
  integrations: [
    expressiveCode({
      themes: ['dracula'],
      plugins: [pluginLineNumbers()],
      styleOverrides: {
        borderRadius: '4px',
        frames: {
          shadowColor: 'transparent',
        },
      },
      useDarkModeMediaQuery: false,
      themeCssSelector: () => false,
      defaultProps: {
        showLineNumbers: true,
      },
    }),
    mdx(),
    sitemap(),
    tailwind(),
    react(),
  ],
});
