import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';

export const Parent = styled('div')`
  width: 100%;
  padding-bottom: 40px;
`;

export const FlexHeader = styled('div')`
  display: flex;
  padding: 12px 32px;
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
`;

export const FlexHeaderRight = styled('div')`
  margin-left: auto;
  display: flex;
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

export const FullWidthButton = styled(LoadingButton)`
  width: 100%;
`;

export const Header = styled('div')`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 24px;
`;
