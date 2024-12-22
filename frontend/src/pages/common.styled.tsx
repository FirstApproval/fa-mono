import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, Tab, TextField, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import {C040036, C04003661} from '../ui-kit/colors';

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

export const TitleRowWrap = styled.div<{
  height?: string;
}>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: ${(props) => props.height ?? 'auto'};
`;

export const SpaceBetween = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SpaceBetweenColumn = styled(SpaceBetween)`
  flex-direction: column;
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

export const FullWidthTextField = styled(TextField)`
  width: 100%;
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

export const FlexWrapRowRadioLabel = styled.span`
  margin-top: 27.5px;
  display: flex;
`;

export const OptionLabelWrap = styled.div<{
  disabled: boolean;
}>`
  /* components/alert-title */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;

  margin-right: 8px;
  color: ${(props) => (props.disabled ? C04003661 : C040036)};
`;
