import { Link, Image } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Logo from '../images/aivan-logo.svg'
import styled from '@emotion/styled'
import { bpDesktopOnly } from '../lib/breakpoints'

const StyledHeader = styled.header`
  margin-bottom: 1.45rem;
  height: 65px;
  max-height: 65px;

  ${bpDesktopOnly} {
    height: 80px;
    max-height: 80px;
  }

  div {
    margin: 0 auto;
    max-width: 960;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  h1 {
    margin: 0;
    display: inline-block;
  }

  a {
    color: #ffffff;
    text-decoration: none;
  }

  img {
    width: 120px;
    ${bpDesktopOnly} {
      width: 150px;
    }
    margin-top: 5px;
  }
`

const Header = ({ siteTitle }) => (
  <StyledHeader>
    <div>
      <h1>
        <Link to="/">
          <img src={Logo} alt="Aivan Monceller" />
        </Link>
      </h1>
    </div>
  </StyledHeader>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: '',
}

export default Header
