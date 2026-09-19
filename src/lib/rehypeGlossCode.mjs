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
 *   <pre tabindex="0"><code><span class="cline">line</span>…</code></pre>
 * </div>
 *
 * Code is set plain — one ink colour — the way the template ships it. Both
 * copy-button label states are baked in so confirming never reflows the row.
 * A `{2,5-7}` meta on the fence marks those lines with the .hl class.
 */

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

function glossify(codeNode) {
  const className = codeNode.properties?.className || []
  const langClass = className.find(c => String(c).startsWith('language-'))
  const lang = langClass ? String(langClass).slice('language-'.length) : 'text'
  const meta = codeNode.data?.meta || codeNode.properties?.metastring || ''
  const isHighlighted = highlightTest(meta)

  const raw = (codeNode.children || [])
    .map(c => c.value || '')
    .join('')
    .replace(/\n$/, '')

  const lines = raw.split('\n').map((line, i) =>
    el(
      'span',
      { className: isHighlighted(i) ? ['cline', 'hl'] : ['cline'] },
      [text(line)]
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
  return tree => {
    const walk = node => {
      if (!node.children) return
      node.children.forEach((child, i) => {
        if (child.type === 'element' && child.tagName === 'pre') {
          const code = (child.children || []).find(
            c => c.type === 'element' && c.tagName === 'code'
          )
          if (code) {
            node.children[i] = glossify(code)
            return
          }
        }
        walk(child)
      })
    }
    walk(tree)
  }
}
