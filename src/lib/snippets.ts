/* Pure search-snippet helpers: no DOM, so the same code runs in the
   browser (src/scripts/search.ts) and under node for verification. */

export function queryTerms(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

/* Reject snippets too short to read or leaking index residue (code fences,
   table syntax, component tags) — ported from the docs reference. */
export function isUsableSnippet(value: unknown): boolean {
  const text = String(value == null ? '' : value).trim()
  if (text.length < 12) return false
  return !/```|\|\s*:?-+:?|__Flags__|<[A-Z]/.test(text)
}

function earliestMatch(haystack: string, terms: string[]): number {
  let best = -1
  for (const term of terms) {
    const at = haystack.indexOf(term)
    if (at >= 0 && (best < 0 || at < best)) best = at
  }
  return best
}

/* A ~190-char window around the earliest query-term match, snapped to word
   boundaries and marked with ellipses where truncated. Returns '' when no
   term occurs in the text. */
export function extractSnippet(
  content: unknown,
  query: string,
  before = 70,
  after = 120
): string {
  const text = String(content == null ? '' : content)
  const terms = queryTerms(query)
  if (!text || terms.length === 0) return ''

  const lowered = text.toLowerCase()
  const at = earliestMatch(lowered, terms)
  if (at < 0) return ''

  let start = Math.max(0, at - before)
  let end = Math.min(text.length, at + after)

  /* snap to word boundaries without swallowing the match itself */
  const spaceBefore = text.lastIndexOf(' ', at)
  if (spaceBefore > start) start = spaceBefore + 1
  const spaceAfter = text.indexOf(' ', end)
  end = spaceAfter < 0 ? text.length : spaceAfter

  let snippet = text.slice(start, end).trim()
  if (start > 0) snippet = '…' + snippet
  if (end < text.length) snippet = snippet + '…'
  return snippet
}

/* Leading window for the no-match fallback: same word snapping, no leading
   ellipsis. */
export function leadingSnippet(content: unknown, length = 160): string {
  const text = String(content == null ? '' : content).trim()
  if (!text) return ''
  if (text.length <= length) return text
  const cut = text.indexOf(' ', length)
  const end = cut < 0 ? text.length : cut
  return text.slice(0, end).trim() + '…'
}
