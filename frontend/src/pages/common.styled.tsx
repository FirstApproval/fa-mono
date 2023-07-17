import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const Parent = styled('div')`
  width: 100%;
`;

export const FlexHeader = styled('div')`
  display: flex;
  padding: 40px 40px 8px 40px;
  align-items: center;
`;

export const FlexHeaderRight = styled('div')`
  margin-left: auto;
`;

export const FlexBodyCenter = styled('div')`
  display: flex;
  justify-content: center;
`;

export const FlexBody = styled('div')`
  width: 580px;
  padding-left: 40px;
  padding-right: 40px;
`;

export const Logo = styled('div')`
  font-weight: 860;
  font-size: 20px;
  cursor: pointer;
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
`;

export const Header = styled('div')`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 24px;
`;
