import type { MDXComponents } from 'mdx/types';
import ColorBox from './components/mdx-components/ColorBox';
import Message from './components/mdx-components/Message';
import Grid from './components/mdx-components/Grid';
import Subtitle from './components/mdx-components/Subtitle';
import SmallTitle from './components/mdx-components/SmallTitle';
import Title from './components/mdx-components/Title';
import Paragraph from './components/mdx-components/Paragraph';
import Separator from './components/mdx-components/Separator';
import List from './components/mdx-components/List';
import NumberedList from './components/mdx-components/NumberedList';
import Anchor from './components/mdx-components/Anchor';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: Subtitle,
    h3: SmallTitle,
    h4: Title,
    p: Paragraph,
    hr: Separator,
    ul: List,
    ol: NumberedList,
    a: Anchor,
    ColorBox,
    Message,
    Grid,
    ...components,
  };
}
