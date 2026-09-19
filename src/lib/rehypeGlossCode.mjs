/**
 * rehype plugin: wrap fenced code blocks in the gloss chrome.
 *
 * <pre><code class="language-x">…</code></pre> becomes
 *
 * <div class="code">
 *   <div class="codetop">
 *     <span><span class="clang">x</span></span>
 *     <button class="act cact" data-code data-fb data-craft-press="scale">
 *       <span class="fb-idle">Copy</span><span class="fb-done">Copied</span>
 *     </button>
 *   </div>
 *   <pre tabindex="0"><code><span class="cline">tokens…</span>…</code></pre>
 * </div>
 *
 * Tokens are painted by shiki with the everforest pair — a forest-green
 * palette on both sides, matching the site's forest/moss themes. Each token
 * carries both colours as CSS variables (--shiki-light / --shiki-dark);
 * global.css picks one per data-theme, so toggling recolours code instantly
 * without re-rendering. Unknown languages fall back to plain ink.
 * A `{2,5-7}` meta on the fence marks those lines with the .hl class.
 */
import { codeToHast } from 'shiki'

const SHIKI_THEMES = { light: 'everforest-light', dark: 'everforest-dark' }

/* everforest-light is set for its own pale paper and reads washed-out on the
   gloss lift tint — same hues, pulled darker until they hold ~4.5:1 there.
   The dark side is left untouched; it is already crisp on the moss ground. */
const LIGHT_CONTRAST = {
  '#5c6a72': '#3f4a44', // foreground, punctuation
  '#939f91': '#6d7869', // comments
  '#8da101': '#5e6e00', // strings, greens
  '#dfa000': '#96700a', // yellows
  '#f57d26': '#c25500', // keywords, oranges
  '#3a94c5': '#2b7099', // blues
  '#35a77c': '#25795a', // aquas
  '#f85552': '#c93a37', // reds
  '#df69ba': '#ab4188', // purples
}

const el = (tagName, properties, children) => ({
  type: 'element',
  tagName,
  properties,
  children,
})
const text = value => ({ type: 'text', value })

function highlightTest(meta) {
  const match = /{([\d,-]+)}/.exec(meta || '')
  if (!match) return () => false
  const ranges = match[1].split(',').map(v => v.split('-').map(n => parseInt(n, 10)))
  return index => {
    const lineNumber = index + 1
    return ranges.some(([start, end]) =>
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start
    )
  }
}

/* Run shiki and return one array of token children per line. Falls back to
   bare text lines when the language is unknown to shiki. */
async function tokenizeLines(raw, lang) {
  try {
    const hast = await codeToHast(raw, {
      lang,
      themes: SHIKI_THEMES,
      defaultColor: false,
      colorReplacements: { 'everforest-light': LIGHT_CONTRAST },
    })
    const pre = hast.children.find(n => n.type === 'element' && n.tagName === 'pre')
    const code = pre.children.find(n => n.type === 'element' && n.tagName === 'code')
    return code.children
      .filter(n => n.type === 'element')
      .map(line => line.children)
  } catch {
    return raw.split('\n').map(line => [text(line)])
  }
}

async function glossify(codeNode) {
  const className = codeNode.properties?.className || []
  const langClass = className.find(c => String(c).startsWith('language-'))
  const lang = langClass ? String(langClass).slice('language-'.length) : 'text'
  const meta = codeNode.data?.meta || codeNode.properties?.metastring || ''
  const isHighlighted = highlightTest(meta)

  const raw = (codeNode.children || [])
    .map(c => c.value || '')
    .join('')
    .replace(/\n$/, '')

  const tokenLines = await tokenizeLines(raw, lang)
  const lines = tokenLines.map((children, i) =>
    el(
      'span',
      { className: isHighlighted(i) ? ['cline', 'hl'] : ['cline'] },
      children
    )
  )

  return el('div', { className: ['code'] }, [
    el('div', { className: ['codetop'] }, [
      el('span', {}, [el('span', { className: ['clang'] }, [text(lang)])]),
      el(
        'button',
        {
          type: 'button',
          className: ['act', 'cact'],
          dataCode: '',
          dataFb: '',
          dataCraftPress: 'scale',
        },
        [
          el('span', { className: ['fb-idle'] }, [text('Copy')]),
          el('span', { className: ['fb-done'], ariaHidden: 'true' }, [text('Copied')]),
        ]
      ),
    ]),
    el('pre', { tabIndex: 0 }, [el('code', {}, lines)]),
  ])
}

export default function rehypeGlossCode() {
  return async tree => {
    const fences = []
    const walk = node => {
      if (!node.children) return
      node.children.forEach((child, i) => {
        if (child.type === 'element' && child.tagName === 'pre') {
          const code = (child.children || []).find(
            c => c.type === 'element' && c.tagName === 'code'
          )
          if (code) {
            fences.push({ parent: node, index: i, code })
            return
          }
        }
        walk(child)
      })
    }
    walk(tree)
    for (const { parent, index, code } of fences) {
      parent.children[index] = await glossify(code)
    }
  }
}
