import styled from 'styled-components';
import { darken } from 'polished';

export const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  list-style: none;
  margin-top: 30px;

  li {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 9px;
    padding: 20px;
    /* max-width: 300px; */

    img {
      align-self: center;
      max-width: 230px;

      &:hover {
        position: absolute;
        transition: all 0.4s ease;
        opacity: 0;
        background-color: #7159c1;
      }
    }

    > strong {
      font-size: 16px;
      line-height: 20px;
      color: #333;
      margin-top: 5px;
    }

    > span {
      font-size: 21px;
      font-weight: bold;
      margin: 5px 0 20px;
    }

    button {
      background: #7159c1;
      color: #fff;
      border: 0;
      border-radius: 9px;
      overflow: hidden;
      margin-top: auto;
      width: 100%;

      display: flex;
      align-self: center;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.03, '#7159c1')};
      }

      div {
        display: flex;
        align-items: center;
        padding: 12px;
        background: rgba(0, 0, 0, 0.1);

        svg {
          margin-right: 5px;
        }
      }

      span {
        padding: 0 10px 0 10px;
        font-size: 12px;
        align-self: center;
        font-weight: bold;
      }
    }
  }
`;
