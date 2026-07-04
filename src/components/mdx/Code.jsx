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
            {tokens.map((line, i) => {
              const { key: linePropsKey, ...lineProps } = getLineProps({
                line,
                key: i,
                className: shouldHighlightLine(i) ? 'highlight-line' : '',
              })
              const tokenCounts = new Map()

              return (
                <div {...lineProps} key={linePropsKey}>
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
                  {line.map((token, tokenIndex) => {
                    const { key: tokenPropsKey, ...tokenProps } = getTokenProps({
                      token,
                      key: tokenIndex,
                    })
                    const tokenSignature = `${token.types.join('.')}:${token.content}`
                    const seenCount = tokenCounts.get(tokenSignature) ?? 0
                    tokenCounts.set(tokenSignature, seenCount + 1)

                    return (
                      <span
                        {...tokenProps}
                        key={`${tokenSignature}:${seenCount}`}
                      />
                    )
                  })}
                </div>
              )
            })}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

export default Code
