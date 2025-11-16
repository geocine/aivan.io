import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const allPosts = await getCollection('blog');
  const posts = allPosts
    .filter(post => post.data.published)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'Aivan Monceller',
    description: 'Building front-end applications, web APIs, system utilities and development tools using JavaScript, TypeScript, C# and Go.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.meta_description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
