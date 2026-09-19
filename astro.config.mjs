import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import rehypeGlossCode from './src/lib/rehypeGlossCode.mjs'

export default defineConfig({
  site: 'https://aivan.io',
  trailingSlash: 'ignore',
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    // built-in highlighting is off: rehypeGlossCode wraps every fence in the
    // gloss chrome and paints tokens itself (shiki, everforest light/dark)
    syntaxHighlight: false,
    processor: unified({ rehypePlugins: [rehypeGlossCode] }),
  },
})
