import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    cover: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    meta_description: z.string().optional(),
    author: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { blog };
