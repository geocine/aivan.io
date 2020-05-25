import React from 'react'

import Subtitle from './Subtitle'
import SmallTitle from './SmallTitle'
import Title from './Title'
import Paragraph from './Paragraph'
import Separator from './Separator'
import List from './List'
import Anchor from './Anchor'
import NumberedList from './NumberedList'
import Code from './Code'
import Message from './Message'
import ColorBox from './ColorBox'
import { Grid } from '@chakra-ui/core'

export default {
  wrapper: ({ children }) => children,
  h2: props => <Subtitle {...props} />,
  h3: props => <SmallTitle {...props} />,
  h4: props => <Title {...props} />,
  p: props => <Paragraph {...props} />,
  hr: props => <Separator {...props} />,
  ul: props => <List {...props} />,
  ol: props => <NumberedList {...props} />,
  a: props => <Anchor {...props} />,
  pre: preProps => {
    const props = preToCodeBlock(preProps)
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />
    } else {
      // it's possible to have a pre without a code in it
      return <pre {...preProps} />
    }
  },
  Message,
  Grid,
  ColorBox,
}

// lifted this from mdx-utils
// it doesn't compile it's code and this busted IE, so I'm just vendoring it.
function preToCodeBlock(preProps) {
  if (
    // children is code element
    preProps.children &&
    // code props
    preProps.children.props &&
    // if children is actually a <code>
    preProps.children.props.mdxType === 'code'
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      className = '',
      ...props
    } = preProps.children.props

    const matches = className.match(/language-(?<lang>.*)/)

    return {
      codeString: codeString.trim(),
      className,
      language:
        matches && matches.groups && matches.groups.lang
          ? matches.groups.lang
          : '',
      ...props,
    }
  }
}
