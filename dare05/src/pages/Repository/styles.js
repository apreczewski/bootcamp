import styled, { css } from 'styled-components';

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Owner = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    color: #7159c1;
    font-size: 16px;
    text-decoration: none;
  }

  img {
    width: 120px;
    border-radius: 50%;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    margin-top: 10px;
  }

  p {
    margin-top: 5px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    text-align: center;
    max-width: 400px;
  }
`;

export const IssuesList = styled.ul`
  padding: 20px;
  border-top: 1px solid #eee;
  list-style: none;

  li {
    display: flex;
    padding: 15px 10px;
    border: 1px solid #eee;
    border-radius: 9px;

    & + li {
      margin-top: 20px;
    }

    img {
      width: 75px;
      height: 75px;
      border-radius: 50%;
      border: 2px solid #eee;
    }

    div {
      flex: 1;
      margin-left: 15px;

      strong {
        font-size: 16px;

        a {
          text-decoration: none;
          color: #333;

          &:hover {
            color: #7159c1;
          }
        }
      }

      p {
        margin-top: 5px;
        font-size: 14px;
        color: #999;
      }
    }

    &:hover {
      background: #eee;
    }
  }
`;

export const Label = styled.span.attrs(props => ({
  labelColor: props.labelColor,
}))`
  ${props =>
    css`
      background: ${`#${props.labelColor}`};
      color: #2b3340;
      border-radius: 9px;
      font-size: 10px;
      font-weight: 600;
      height: 20px;
      line-height: 15px;
      margin-left: 10px;
      padding: 5px;
    `}
`;