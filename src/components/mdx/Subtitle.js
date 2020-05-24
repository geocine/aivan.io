import styled from '@emotion/styled'

export default styled.h2`
  text-align: left;
  font-size: 32px;
  line-height: 1.1;
  color: #006cb7;
  display: flex;
  margin-top: 50px;
  margin-bottom: 25px;
  &::after {
    content: ' ';
    background: linear-gradient(to right, #007cd2, #aedeff);
    height: 2px;
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: auto;
    margin: 0.89em 2px 0 3px;
    flex-grow: 1;
    border-radius: 2px;
  }
`
