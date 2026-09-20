import GithubSlugger from 'github-slugger'
import {
  formatRailDate,
  getPostPath,
  getReadingTime,
  getSortedPosts,
  type BlogPost,
} from '../lib/posts'

/* Static search index, one JSON fetch for the whole archive: one record per
   post plus one record per h2/h3 section, each section linking to its
   #anchor — the docs-site pattern. Body text is stripped of markdown so
   FlexSearch indexes words, not syntax. */

const PAGE_CONTENT_CAP = 8000
const SECTION_CONTENT_CAP = 4000

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .trim()
}

function stripMarkdown(body: string): string {
  return (
    body
      // Remove frontmatter
      .replace(/^---[\s\S]*?---/, '')
      // Remove MDX import/export lines
      .replace(/^(import|export)\s.*$/gm, '')
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
  )
}

/* First sentence of a stripped section — the snippet fallback when the query
   terms sit outside the match window. */
function extractDescription(cleaned: string): string {
  if (!cleaned) return ''
  const sentence = cleaned.match(/^[A-Z0-9][\s\S]{11,}?(?:[.!?](?=\s+[A-Z]|$)|(?=:)|$)/)
  const description = (sentence ? sentence[0] : cleaned).replace(/\s+/g, ' ').trim()
  if (/```|\| :---|__Flags__|<[A-Z]/.test(description)) return ''
  return description
}

type Section = {
  level: number
  title: string
  slug: string
  text: string
}

/* Split a post into its h2/h3 sections. Code fences and comments are removed
   first so `#` lines inside them never read as headings; every heading of
   any level feeds the slugger so duplicate-numbering matches Astro's
   rendered ids exactly. */
function extractSections(body: string): Section[] {
  /* normalize CRLF first: `.` never matches `\r`, so the heading pattern
     below would miss every line otherwise */
  const scan = body
    .replace(/\r\n?/g, '\n')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')

  const lines = scan.split('\n')
  const slugger = new GithubSlugger()
  const sections: Section[] = []
  let current: { level: number; title: string; slug: string; lines: string[] } | null =
    null

  const flush = () => {
    if (current) {
      sections.push({
        level: current.level,
        title: current.title,
        slug: current.slug,
        text: current.lines.join('\n'),
      })
      current = null
    }
  }

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      const title = stripInlineMarkdown(heading[2])
      /* every heading consumes a slug — duplicates across levels share
         Astro's per-document counter */
      const slug = slugger.slug(title)
      if (level === 1) {
        flush()
        continue
      }
      if (level === 2 || level === 3) {
        flush()
        current = { level, title, slug, lines: [] }
        continue
      }
      /* h4-h6 stay inside the enclosing section */
      if (current) current.lines.push(line)
      continue
    }
    if (current) current.lines.push(line)
  }
  flush()

  return sections
}

function cap(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim()
}

export async function GET() {
  const posts = await getSortedPosts()

  const searchData = posts.flatMap((post: BlogPost) => {
    const path = getPostPath(post)
    const date = formatRailDate(post.data.date)
    const time = getReadingTime(post)
    const category = post.data.category
    const tags = (post.data.tags ?? []).join(' ')
    const body = post.body ?? ''

    const pageRecord = {
      kind: 'page',
      title: post.data.title,
      url: path,
      post: post.data.title,
      postUrl: path,
      category,
      tags,
      date,
      time,
      summary: post.data.meta_description,
      content: cap(stripMarkdown(body), PAGE_CONTENT_CAP),
    }

    const sectionRecords = extractSections(body).map(section => {
      const content = cap(stripMarkdown(section.text), SECTION_CONTENT_CAP)
      return {
        kind: 'section',
        title: section.title,
        url: `${path}#${section.slug}`,
        post: post.data.title,
        postUrl: path,
        category,
        tags,
        date,
        time,
        summary: extractDescription(content),
        content,
      }
    })

    return [pageRecord, ...sectionRecords]
  })

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
