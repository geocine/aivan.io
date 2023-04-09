import React from 'react'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/react'
import Header from './Header'
import Footer from './Footer'

const StyledLayout = styled.div`
  position: relative;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  min-height: 100vh;
`

export const globalStyles = css`
  body {
    position: relative;
  }
`

const Layout = ({ children }) => (
  <StyledLayout>
    <Global styles={globalStyles} />
    <Header />
    <main>{children}</main>
    <Footer />
  </StyledLayout>
)

export default Layout
