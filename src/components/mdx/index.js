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
import { Grid } from '@chakra-ui/react'

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

// lifted this from https://github.com/nutstick/nutstick.dev/blob/master/apps/blog/utils/preToCodeBlock.ts
const isHTMLCodeElement = (element) => {
  // @ts-expect-error cast type
  return element.props && element.type;
};

export const preToCodeBlock = (preProps) => {
  const child = preProps.children;
  if (isHTMLCodeElement(child)) {
    const { children: codeString, className = '', ...props } = child.props;

    const match = className.match(/language-([\0-\uFFFF]*)/);

    return match != null && typeof codeString === 'string'
      ? {
          codeString: codeString.trim(),
          className,
          language: match[1],
          // @ts-expect-error custom properties
          meta: props.meta,
        }
      : null;
  }
};