import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, Tab, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

export const Parent = styled.div`
  width: 100%;
  padding-bottom: 40px;
  min-height: calc(100vh - 104px);
`;

export const FlexBodyCenter = styled.div`
  display: flex;
  justify-content: center;
`;

export const FlexBody = styled.div`
  width: 580px;
  padding-left: 40px;
  padding-right: 40px;
`;

export const Logo = styled.div`
  cursor: pointer;
  display: flex;
`;

export const CursorPointer = styled.div`
  cursor: pointer;
`;

export const FullWidthButton = styled(LoadingButton)`
  width: 100%;
`;

export const Header = styled.div`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 24px;
  white-space: pre-line;
`;

export const HeightElement = styled('div')<{ value?: string }>`
  height: ${(props) => props.value ?? '0px'};
`;

export const WidthElement = styled('div')<{ value?: string }>`
  width: ${(props) => props.value ?? '0px'};
`;

export const CustomTab = styled(Tab)`
  color: var(--text-secondary, #68676e);
`;

export const ColumnElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const TitleRowWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SpaceBetween = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledMenuItem = styled(MenuItem)`
  &:hover {
    background-color: transparent;
  }
`;

export const Width100Percent = styled.div`
  width: 100%;
`;

export const FullWidth = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FlexWrapColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexWrapRow = styled.div`
  display: flex;
`;

export const ValidationError = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  padding: 6px 16px;
  align-items: center;
  border-radius: 4px;
  background: var(--alert-error-fill, #fdeded);
`;

export const ValidationErrorText = styled(Typography)`
  color: var(--alert-error-content, #5f2120);
`;

export const CircularProgressWrap = styled(CircularProgress)`
  margin-left: 12px;
  margin-right: 12px;
`;

export const PrefilledDetails = styled.div`
  border-radius: 4px;
  background: var(--alert-info-fill, #e5f6fd);

  display: flex;
  width: 500px;
  padding: 6px 16px;
  align-items: flex-start;
  justify-content: start;
`;

export const PrefilledDetailsText = styled(Typography)`
  margin-left: 12px;
  color: var(--alert-info-content, #014361);
  padding-top: 8px;
  padding-bottom: 8px;
`;
