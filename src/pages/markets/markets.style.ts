import styled from '@emotion/styled';

export const Table = styled.table`
  width: 100%;
`;

export const TableBody = styled.tbody``;

export const TableHeadTop = styled.thead``;

export const TableRow = styled.tr<{ colorMode: string }>`
  background-color: ${(props) =>
    props.colorMode === 'light' ? '#f4f5f9' : '#777'};
  border-bottom: 1px solid
    ${(props) => (props.colorMode === 'light' ? '#252c41' : '#121212')};
`;

export const TableHead = styled.th<{
  roundedLeft?: boolean;
  roundedRight?: boolean;
  colorMode?: string;
}>`
  border-bottom: 1px solid #ddd;
  background-color: ${(props) =>
    props.colorMode === 'light' ? '#252c41' : '#121212'};
  color: #f4f5f9;
  border-top-left-radius: ${(props) => (props.roundedLeft ? '0.5rem' : 0)};
  border-top-right-radius: ${(props) => (props.roundedRight ? '0.5rem' : 0)};
`;
