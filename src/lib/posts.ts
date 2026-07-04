import { getCollection, type CollectionEntry } from 'astro:content'
import authors from '../../content/data/authors.json'

export type BlogPost = CollectionEntry<'blog'>

const postDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
})

export function getPostSlug(post: BlogPost) {
  return post.id.replace(/\/index$/, '')
}

export function getPostPath(post: BlogPost) {
  return `/${getPostSlug(post)}/`
}

export function getPostCover(post: BlogPost) {
  const coverPath = post.data.cover

  if (/^https?:\/\//.test(coverPath)) {
    return coverPath
  }

  if (coverPath.startsWith('/assets/')) {
    return coverPath
  }

  const slug = getPostSlug(post)
  const cover = coverPath.replace(/^\/|\/$/g, '')
  return `${slug}/${cover}`
}

export function formatPostDate(date: Date) {
  return postDateFormatter.format(date)
}

export async function getSortedPosts() {
  const posts = await getCollection('blog', ({ data }) => data.published !== false)

  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getAuthor(id: string) {
  return authors.find(author => author.id === id)
}
