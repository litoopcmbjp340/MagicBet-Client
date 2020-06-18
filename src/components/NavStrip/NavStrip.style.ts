import styled from '@emotion/styled';

const white = '#f4f5f9';

export const StyledLink = styled.a<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  cursor: pointer;
  text-decoration: none;
  border-bottom-width: 2px;
  color: ${(props) => (props.active ? white : '#dddfe6')};
  border-bottom-color: ${(props) => (props.active ? white : 'transparent')};
  &:hover {
    color: #f4f5f9;
    border-bottom-color: #f4f5f9;
    border-bottom-width: 2px;
  }
`;

export const Wrapper = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;
