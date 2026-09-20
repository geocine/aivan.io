/**
 * Realtime search, following astro-chirpy's implementation: a static
 * /search.json index, FlexSearch with forward tokenization, a debounced
 * input listener, and live results that replace the page content while a
 * query is present. Clearing the query puts the page back exactly where
 * it was.
 */

import type { Index as SearchIndex } from 'flexsearch'
import { extractSnippet, isUsableSnippet, leadingSnippet } from '../lib/snippets'

type SearchDoc = {
  kind: 'page' | 'section'
  title: string
  url: string
  post: string
  postUrl: string
  category: string
  tags: string
  date: string
  time: string
  summary: string
  content: string
}

let searchData: SearchDoc[] = []
let searchIndex: SearchIndex | null = null
let searchDataLoaded = false
let searchDataPromise: Promise<void> | null = null

async function loadSearchData() {
  if (searchDataLoaded) return

  try {
    const [{ Index }, response] = await Promise.all([
      import('flexsearch'),
      fetch('/search.json'),
    ])
    if (!response.ok) {
      console.error('Failed to load search data')
      return
    }

    searchData = await response.json()

    searchIndex = new Index({
      tokenize: 'forward',
      cache: 100,
      resolution: 9,
      context: true,
    })

    searchData.forEach((item, index) => {
      const searchableText = `${item.title} ${item.post} ${item.category} ${item.tags} ${item.content}`
      searchIndex?.add(index, searchableText)
    })

    searchDataLoaded = true
  } catch (error) {
    console.error('Error loading search data:', error)
  }
}

function ensureSearchDataLoaded() {
  if (!searchDataPromise) {
    searchDataPromise = loadSearchData()
  }
  return searchDataPromise
}

function performSearch(query: string): SearchDoc[] {
  if (!searchIndex || !searchDataLoaded || !query.trim()) {
    return []
  }

  try {
    const results = searchIndex.search(query, { limit: 20 })
    return results.map(idx => searchData[idx as number]).filter(Boolean)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

function esc(s: unknown) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  })
}

function highlightText(value: unknown, query: string) {
  const text = String(value == null ? '' : value)
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (!terms.length) return esc(text)

  const splitPattern = new RegExp(`(${terms.join('|')})`, 'gi')
  const matchPattern = new RegExp(`^(?:${terms.join('|')})$`, 'i')

  return text
    .split(splitPattern)
    .map(part =>
      matchPattern.test(part)
        ? '<mark class="search-highlight">' + esc(part) + '</mark>'
        : esc(part)
    )
    .join('')
}

/* Snippet preference: the match window first so the highlighted terms are
   always visible, then the record summary, then the content lead. */
function snippetFor(doc: SearchDoc, query: string) {
  const window = extractSnippet(doc.content, query)
  if (isUsableSnippet(window)) return highlightText(window, query)
  if (isUsableSnippet(doc.summary)) return highlightText(doc.summary, query)
  const lead = leadingSnippet(doc.content)
  if (isUsableSnippet(lead)) return highlightText(lead, query)
  return ''
}

function snippetLine(doc: SearchDoc, query: string) {
  const snippet = snippetFor(doc, query)
  return snippet ? '<p class="sum">' + snippet + '</p>' : ''
}

function sourceLine(doc: SearchDoc) {
  if (doc.kind !== 'section') return ''
  return (
    '<p class="sum">in <a href="' + esc(doc.postUrl) + '">' + esc(doc.post) + '</a></p>'
  )
}

function resultRow(doc: SearchDoc, query: string) {
  return (
    '<div class="row"><div class="gl ent"><span class="rl">' +
    esc(doc.date) +
    '</span><span class="rl">' +
    esc(doc.category) +
    ' · ' +
    esc(doc.time) +
    '</span></div><div class="gr ent"><p class="etitle"><a href="' +
    esc(doc.url) +
    '">' +
    highlightText(doc.title, query) +
    '</a></p>' +
    snippetLine(doc, query) +
    sourceLine(doc) +
    '</div></div>'
  )
}

function countLabel(n: number) {
  return n + (n === 1 ? ' result' : ' results')
}

/* The header renders on every keystroke so the view answers instantly; the
   rows stay debounced below it. While a search is pending the count reads
   as an ellipsis. */
function renderHead(query: string, count: string) {
  return (
    '<div class="row rowt"><div class="gl hd"><h1 class="term">search</h1><span class="rl" id="search-count">' +
    esc(count) +
    '</span></div><div class="gr hd"><p class="def">Results for \u201c' +
    esc(query) +
    '\u201d across all posts.</p></div></div>'
  )
}

function renderRows(query: string, docs: SearchDoc[]) {
  if (docs.length) return docs.map(doc => resultRow(doc, query)).join('')
  return (
    '<div class="row rowt"><div class="gl sp"><h2 class="slab">no matches</h2></div>' +
    '<div class="gr sp"><p class="sum">Nothing matches that term. Every post is reachable from <a href="/">home</a>.</p></div></div>'
  )
}

export function initSearch() {
  const input = document.getElementById('search-input') as HTMLInputElement | null
  const form = input?.closest('form')
  const page = document.getElementById('page-content')
  const live = document.getElementById('search-live')
  const results = document.getElementById('search-results-live')
  const head = document.getElementById('search-results-head')
  const announcer = document.getElementById('announcer')
  if (!input || !page || !live || !results || !head) return

  function announce(m: string) {
    if (announcer) announcer.textContent = m
  }

  /* Live results replace the page content while a query is present; the
     scroll position comes back with the page when the query is cleared. */
  let resultsVisible = false
  let savedScroll = 0

  /* The craft entry rise: apply the start state, flush it, then transition
     from it — setting both states in one task would skip the transition.
     Played only when the page returns after search; results themselves
     render instantly as you type, with no animation. */
  const entryTimers = new WeakMap<HTMLElement, number>()
  function playEntry(el: HTMLElement) {
    const prev = entryTimers.get(el)
    if (prev) window.clearTimeout(prev)
    el.setAttribute('data-enter', 'set')
    void el.offsetHeight
    el.setAttribute('data-enter', 'play')
    entryTimers.set(
      el,
      window.setTimeout(() => el.removeAttribute('data-enter'), 450)
    )
  }

  function resultsOn() {
    if (resultsVisible) return
    savedScroll = window.scrollY
    page!.hidden = true
    live!.hidden = false
    resultsVisible = true
    window.scrollTo(0, 0)
  }

  function resultsOff() {
    if (!resultsVisible) return
    live!.hidden = true
    live!.removeAttribute('data-enter')
    page!.hidden = false
    head!.innerHTML = ''
    results!.innerHTML = ''
    resultsVisible = false
    window.scrollTo(0, savedScroll)
    playEntry(page as HTMLElement)
  }

  async function runSearch(query: string) {
    await ensureSearchDataLoaded()
    const docs = performSearch(query)
    const count = countLabel(docs.length)
    head!.innerHTML = renderHead(query, count)
    /* the count eases in so … → "N results" reads as a transition,
       not a flicker — opacity only, which the reduced-motion policy keeps */
    document.getElementById('search-count')?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 160,
      easing: 'ease-out',
    })
    results!.innerHTML = renderRows(query, docs)
    announce(count + ' for ' + query)
  }

  /* Warm the index the moment the field gets attention, so the first
     keystroke searches instead of fetching. */
  input.addEventListener('focus', () => {
    ensureSearchDataLoaded()
  })

  // Debounce search to avoid too many searches
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  input.addEventListener('input', () => {
    const query = input.value.trim()

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (query === '') {
      resultsOff()
    } else {
      resultsOn()
      /* header answers every keystroke; rows follow on debounce */
      head!.innerHTML = renderHead(query, '…')
      // Debounce search by 200ms
      searchTimeout = setTimeout(() => {
        runSearch(query)
      }, 200)
    }
  })

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      input.value = ''
      resultsOff()
    }
  })

  /* Results are already live; submitting would only reload the page. */
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault()
    })
  }

  /* Deep links: /search/?q=term seeds the field and renders immediately. */
  if (location.pathname.replace(/\/$/, '') === '/search') {
    const q = new URLSearchParams(location.search).get('q') || ''
    if (q) {
      input.value = q
      resultsOn()
      head!.innerHTML = renderHead(q, '…')
      runSearch(q)
    }
  }
}

initSearch()
