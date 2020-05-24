import styled from '@emotion/styled'

export default styled.ul`
  margin-left: 20px;
  padding: 0;
  list-style-type: none;
  li {
    ::before {
      content: '';
      left: -20px;
      margin-top: 11px;
      position: absolute;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 6px solid #006cb7;
      top: -3px;
    }
    position: relative;
    border-bottom: 2px solid #aedeff;
    margin-bottom: 0.8em;
    padding-bottom: 0.7em;
  }
`
