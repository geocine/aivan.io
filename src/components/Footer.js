import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import Logo from '../images/aivan-logo-reverse.svg'
const StyledFooter = styled.footer`
  background: #006cb7;
  min-height: 200px;
  text-align: center;
  padding: 15px;
  color: #fff;
  font-size: 14px;
  margin-top: auto;

  img {
    width: 150px;
    height: 58px;
    margin: 0 auto;
  }

  p {
    margin: 5px 0;
  }

  .subtitle {
    color: rgb(189, 204, 237);
    margin: 25px 0;
  }
`

const Footer = () => (
  <StyledFooter>
    <Link to="/">
      <img src={Logo} alt="Aivan Monceller" />
    </Link>
    <p className="subtitle">
      Building front-end applications, web APIs, system utilities and
      development tools using JavaScript, TypeScript, C# and Go.
    </p>
    <p>
      {new Date().getFullYear()}
      {` `}
      <a href="https://aivan.io">Aivan Monceller</a>. All Rights Reserved
    </p>
  </StyledFooter>
)

export default Footer
