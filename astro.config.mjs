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
    // the gloss code block is set plain — one ink colour, no token painting —
    // and rehypeGlossCode wraps every fence in the template's chrome
    syntaxHighlight: false,
    processor: unified({ rehypePlugins: [rehypeGlossCode] }),
  },
})
