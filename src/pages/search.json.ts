import {
  formatRailDate,
  getPostPath,
  getReadingTime,
  getSortedPosts,
} from '../lib/posts'

/* Static search index, one JSON fetch for the whole archive. The body text is
   stripped of markdown so FlexSearch indexes words, not syntax. */
export async function GET() {
  const posts = await getSortedPosts()

  const searchData = posts.map(post => {
    let content = (post.body ?? '')
      // Remove frontmatter
      .replace(/^---[\s\S]*?---/, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove code blocks (fenced and indented)
      .replace(/```[\s\S]*?```/g, '')
      .replace(/~~~[\s\S]*?~~~/g, '')
      // Remove inline code
      .replace(/`[^`]*`/g, '')
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Convert links to text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove heading markers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove strikethrough
      .replace(/~~(.*?)~~/g, '$1')
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, '')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()

    // Cap the indexed text so the payload stays small while still covering
    // mentions deep inside a post.
    if (content.length > 8000) {
      content = content.substring(0, 8000).trim()
    }

    return {
      title: post.data.title,
      url: getPostPath(post),
      category: post.data.category,
      tags: (post.data.tags ?? []).join(' '),
      date: formatRailDate(post.data.date),
      time: getReadingTime(post),
      summary: post.data.meta_description,
      content,
    }
  })

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
