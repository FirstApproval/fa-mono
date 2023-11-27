import styled from '@emotion/styled';
import { ReactElement } from 'react';

export const Header = (): ReactElement => {
  return <HeaderWrap></HeaderWrap>;
};

const HeaderWrap = styled.div`
  padding: 30px 40px;

  display: flex;
`;
