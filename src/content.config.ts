import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    meta_description: z.string(),
    author: z.string(),
    published: z.boolean().optional().default(false),
  }),
})

export const collections = { blog }
