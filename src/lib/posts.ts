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

/* the rail speaks mono: 2026.07.04, not "July 04, 2026" */
export function formatRailDate(date: Date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export function getReadingTime(post: BlogPost) {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 220))} min`
}

export async function getSortedPosts() {
  const posts = await getCollection('blog', ({ data }) => data.published !== false)

  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function getAuthor(id: string) {
  return authors.find(author => author.id === id)
}
