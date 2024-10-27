import { type ReactElement } from 'react';
import styled from '@emotion/styled';
import { HeaderComponent } from '../../../components/HeaderComponent';
import { Helmet } from 'react-helmet';
import BreadCrumbs from '../BreadCrumbs';

import Chat from './Chat';
import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import Button from '@mui/material/Button';
import { FlexWrapColumn, HeightElement } from '../../common.styled';
import { TextSizeTruncation } from '../../../util/stylesUtil';

export const ChatPage = (): ReactElement => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={'Chat with __firstname__ __lastname__'}
        />
        <title>Chat with __firstname__ __lastname__</title>
      </Helmet>
      <Parent>
        <HeaderBorderColorFix>
          <HeaderComponent
            showPublishButton={true}
            showCollaborateButton={true}
            showBottomStyleGap={false}
          />
        </HeaderBorderColorFix>
        <Container>
          <LeftPanel>
            <FlexWrapColumn>
              <LeftPanelHeader variant={'h6'}>My datasets</LeftPanelHeader>
              <List sx={{ width: '100%' }}>
                <ListItemButton sx={{ width: '100%', borderRadius: '8px' }}>
                  <ListItemText
                    primary={TextSizeTruncation(
                      'Lorem ipsum dolor sit amet consectetur adipiscing elit',
                      26
                    )}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  />
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      marginLeft: 'auto'
                    }}>
                    <FiberManualRecordIcon
                      sx={{ fontSize: 18, color: 'primary.main' }}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </List>
              <HeightElement value={'10px'} />
              <LeftPanelHeader variant={'h6'}>
                Downloaded datasets
              </LeftPanelHeader>
              <List sx={{ width: '100%' }}>
                <ListItemButton sx={{ width: '100%', borderRadius: '8px' }}>
                  <ListItemText
                    primary={TextSizeTruncation(
                      'Lorem ipsum dolor sit amet consectetur adipiscing elit',
                      26
                    )}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  />
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      marginLeft: 'auto'
                    }}>
                    <FiberManualRecordIcon
                      sx={{ fontSize: 18, color: 'primary.main' }}
                    />
                  </ListItemIcon>
                </ListItemButton>
                <ListItemButton sx={{ width: '100%', borderRadius: '8px' }}>
                  <ListItemText
                    primary={TextSizeTruncation(
                      'Lorem ipsum dolor sit amet consectetur adipiscing elit',
                      26
                    )}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  />
                </ListItemButton>
              </List>
            </FlexWrapColumn>
          </LeftPanel>
          <RightPanel>
            <BreadCrumbs name={'Peter Lidsky'} />
            <BodyWrap>
              <BodyContentWrap>
                <Chat />
              </BodyContentWrap>
            </BodyWrap>
          </RightPanel>
        </Container>
      </Parent>
    </>
  );
};

const HeaderBorderColorFix = styled.div`
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #d2d2d6;
  }
`;

const Parent = styled.div`
  width: 100%;
  padding-bottom: 40px;
  min-height: calc(100vh - 104px);
`;

const BodyWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BodyContentWrap = styled.div`
  width: 680px;
  padding: 48px 32px;
`;

const LeftPanel = styled.div`
  flex: 22%;
  display: flex;
  max-width: 300px;
  flex-direction: column;
  align-items: start;
  border-right: 1px solid #d2d2d6;

  justify-content: space-between;
  padding: 22px;
`;

const LeftPanelHeader = styled(Typography)`
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-size: 0.8rem;
  padding-left: 16px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 88%;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;
