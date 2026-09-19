import Message from './Message'
import ColorBox from './ColorBox'

/* Fenced code blocks are handled at build time by rehypeGlossCode — the
   gloss chrome (language label, copy action, line marks) is baked into the
   HTML, so no `pre` override is needed here. */

const Grid = ({ children, templateColumns, gap = 0, ...props }) => (
  <div
    className="mdx-grid"
    style={{
      gridTemplateColumns: Array.isArray(templateColumns)
        ? templateColumns[templateColumns.length - 1]
        : templateColumns,
      gap: typeof gap === 'number' ? `${gap * 4}px` : gap,
    }}
    {...props}
  >
    {children}
  </div>
)

export default {
  wrapper: ({ children }) => children,
  Message,
  Grid,
  ColorBox,
}
