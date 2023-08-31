import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Tab } from '@mui/material';

export const Parent = styled.div`
  width: 100%;
  padding-bottom: 40px;
  min-height: calc(100vh - 104px);
`;

export const FlexHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #eeeeee;
  padding: 12px 32px;
  height: 64px;
  margin-bottom: 80px;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;

  background-color: #fff;
  z-index: 10;
`;

export const FlexHeaderRight = styled.div`
  margin-left: auto;
  display: flex;
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

export const FullWidthButton = styled(LoadingButton)`
  width: 100%;
`;

export const Header = styled.div`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 24px;
`;

export const HeightElement = styled('div')<{ value?: string }>`
  height: ${(props) => props.value ?? '0px'};
`;

export const WidthElement = styled('div')<{ value?: string }>`
  width: ${(props) => props.value ?? '0px'};
`;

export const CustomTab = styled(Tab)`
  color: var(--text-secondary, #68676e);
  font-feature-settings: 'clig' off, 'liga' off;
  /* components/button-large */
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px; /* 144.444% */
  letter-spacing: 0.46px;
`;

export const ColumnElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
