// src/@chakra-ui/gatsby-plugin/theme.js
// Attempted import error: 'baseTheme' is not exported from './theme' (imported as 'baseTheme')
import { extendTheme } from "@chakra-ui/react"
const theme = {
  colors: {
    major: '#006cb7',
    minor: '#ff8e01',
    sharp: '#8ac73d',
  },
}

export const baseTheme = extendTheme(theme)
export default extendTheme(theme)