import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    img: z.string(),
  })

});
export const collections = { posts };
