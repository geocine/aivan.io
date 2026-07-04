import theme from '../../lib/codeTheme'
import Highlight, { defaultProps } from 'prism-react-renderer'

const RE = /{([\d,-]+)}/

const wrapperStyle = {
  overflow: 'auto',
  marginBottom: 20,
  marginTop: 20,
}

const preStyle = {
  float: 'left',
  minWidth: '100%',
  overflow: 'initial',
}

function calculateLinesToHighlight(meta) {
  if (RE.test(meta)) {
    const lineNumbers = RE.exec(meta)[1]
      .split(',')
      .map(v => v.split('-').map(y => parseInt(y, 10)))
    return index => {
      const lineNumber = index + 1
      const inRange = lineNumbers.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start
      )
      return inRange
    }
  } else {
    return () => false
  }
}

function Code({ codeString, language, meta = '' }) {
  const shouldHighlightLine = calculateLinesToHighlight(meta)
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div style={wrapperStyle}>
          <pre className={className} style={{ ...style, ...preStyle }}>
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({
                  line,
                  key: i,
                  className: shouldHighlightLine(i) ? 'highlight-line' : '',
                })}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '2em',
                    userSelect: 'none',
                    opacity: 0.3,
                  }}
                >
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

export default Code
