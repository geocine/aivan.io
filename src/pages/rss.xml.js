import rss from '@astrojs/rss'
import { getPostCover, getPostPath, getSortedPosts } from '../lib/posts'
import { site } from '../site'

export async function GET(context) {
  const posts = await getSortedPosts()

  return rss({
    title: 'aivan.io RSS Feed',
    description: site.description,
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.meta_description,
      link: getPostPath(post),
      content: post.data.meta_description,
      customData: `<media:content url="${site.imageHost}/${getPostCover(post)}" medium="image" type="image/png" />`,
    })),
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    customData: '<language>en-us</language>',
  })
}
