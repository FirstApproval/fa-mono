import React, { MouseEventHandler, type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { HeaderComponent } from '../../components/HeaderComponent';
import { Helmet } from 'react-helmet';
import { getInitials, renderProfileImage } from '../../util/userUtil';
import { DateViewsDownloadsCollaborators } from '../publication/DateViewsDownloadsCollaborators';
import { CollabRequestBox, CollabRequestBoxStatus } from './CollabRequestBox';
import BreadCrumbs from './BreadCrumbs';

import Chat from './chat/Chat';
import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Button from '@mui/material/Button';
import { FlexWrapColumn, HeightElement } from '../common.styled';

function TextSizeTruncator(text: string, maxLength: number): string {
  const textLength = text.length;
  if (textLength > maxLength) {
    return text.substring(0, maxLength) + '...';
  } else {
    return text;
  }
}

export const CollaboratePage = (): ReactElement => {
  // <Helmet>
  //   <meta name="description" content={publicationStore.title} />
  // </Helmet>;
  // <HeaderComponent
  //   showPublishButton={true}
  //   showLoginButton={true}
  //   showSignUpContainedButton={true}
  // />;

  const goToChat = (chatId: number): void => {
    console.log(chatId);
  };

  return (
    <Container>
      <LeftPanel>
        <FlexWrapColumn>
          <LeftPanelHeader variant={'h6'}>My datasets</LeftPanelHeader>
          <List sx={{ width: '100%' }}>
            <ListItemButton sx={{ width: '100%', borderRadius: '8px' }}>
              <ListItemText
                primary={TextSizeTruncator(
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
          <LeftPanelHeader variant={'h6'}>Downloaded datasets</LeftPanelHeader>
          <List sx={{ width: '100%' }}>
            <ListItemButton sx={{ width: '100%', borderRadius: '8px' }}>
              <ListItemText
                primary={TextSizeTruncator(
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
                primary={TextSizeTruncator(
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
            <HeaderWrap>
              <HeaderTitleWrap>
                <Typography variant={'h5'}>Collaboration dashboard</Typography>
                <MarginLeftAuto />
              </HeaderTitleWrap>
              <HeightElement value={'36px'} />
            </HeaderWrap>
            <div
              style={{
                marginBottom: '24px',
                color: '#68676E',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '150%',
                letterSpacing: '0.15px'
              }}>
              This page helps you manage collaboration requests from data users
              who plan to reuse/include your data in their upcoming
              publications.
            </div>
            <DatasetStatsWrapper>
              <DateViewsDownloadsCollaborators
                openDownloadersDialog={() => false}
                openCollaborationRequestsDialog={() => false}
                displayLicense={false}
                publicationStore={false as any}
              />
            </DatasetStatsWrapper>
            <HeightElement value={'36px'} />
            <Typography variant={'h6'}>Received requests</Typography>
            <HeightElement value={'12px'} />
            <CollabRequestBox
              onClick={() => goToChat(1)}
              avatar={'PL'}
              name={'Peter Lidsky'}
              status={CollabRequestBoxStatus.NEW}>
              Mice brain control/ex fertilization RNA-seq data
            </CollabRequestBox>
            <HeightElement value={'24px'} />
            <CollabRequestBox
              onClick={() => goToChat(2)}
              avatar={'MP'}
              name={'Maria Petrova '}
              status={CollabRequestBoxStatus.APPROVED}>
              DNA damage in mice bone marrow cells after acute treatment by
              restraint and olfactory stressors
            </CollabRequestBox>
            <HeightElement value={'24px'} />
            <CollabRequestBox
              onClick={() => goToChat(3)}
              avatar={'MP'}
              name={'John D. Gearhart'}
              status={CollabRequestBoxStatus.DECLINED}>
              Independent Evolution of RNA Structures in BRD2 and BRD3 Genes
              Governs Control of Unproductive Splicing
            </CollabRequestBox>
            <Chat />
          </BodyContentWrap>
        </BodyWrap>
      </RightPanel>
    </Container>
  );
};

const HeaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderTitleWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const MarginLeftAuto = styled.div`
  margin-left: auto;
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

const DatasetStatsWrapper = styled.div`
  border: 1px solid #d2d2d6;
  padding: 20px 24px;
  border-radius: 8px;
`;
