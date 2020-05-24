import React from 'react'
import styled from '@emotion/styled'

const StyledMessage = styled.p`
  background: #fff1df;
  padding: 0.8em 1em;
  border-left: 4px solid rgb(255, 142, 1);
  color: #4a2900;
  line-height: 1.2;
  text-align: center;
  position: relative;
  clear: both;
  &.warning {
    background: rgba(247, 168, 139, 0.15);
    border-left: 4px solid rgb(255, 96, 69);
  }
  &.success {
    border-left: 4px solid rgb(138, 199, 61);
    color: rgb(41, 100, 1);
    background: rgb(234, 245, 231);
  }
`

const Message = ({ type, children }) => {
  return <StyledMessage className={type}>{children}</StyledMessage>
}

export default Message
