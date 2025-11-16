import type { MDXComponents } from 'mdx/types';
import ColorBox from './components/mdx-components/ColorBox';
import Message from './components/mdx-components/Message';
import Grid from './components/mdx-components/Grid';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ColorBox,
    Message,
    Grid,
    ...components,
  };
}
