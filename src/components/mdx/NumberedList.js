import styled from '@emotion/styled'

export default styled.ol`
  display: block;
  padding: 0 0 0 30px;
  list-style: none;
  counter-reset: numList;
  li {
    ::before {
      counter-increment: numList;
      content: counter(numList);

      position: absolute;
      left: -30px;
      top: -1px;

      font-size: 16px;
      text-align: center;
      color: #fff;
      line-height: 24px;

      width: 25px;
      height: 25px;
      background: #0161ab;

      -moz-border-radius: 50%;
      border-radius: 50%;
    }
    img {
      margin: 15px 0;
      border-radius: 5px;
    }
    position: relative;
    margin-bottom: 10px;
  }
`
