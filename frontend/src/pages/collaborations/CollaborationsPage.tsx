import { useState, type ReactElement } from 'react';
import styled from '@emotion/styled';
import { HeaderComponent } from '../../components/HeaderComponent';
import { Helmet } from 'react-helmet';
import { DateViewsDownloadsCollaborators } from '../publication/DateViewsDownloadsCollaborators';
import {
  CollaborationRequestBox,
  CollaborationRequestBoxStatus
} from './CollaborationRequestBox';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';

import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { FlexWrapColumn, HeightElement } from '../common.styled';
import { TextSizeTruncation } from '../../util/stylesUtil';
import { set } from 'lodash';
import NoPublicationsImage from '../../assets/no-publications.svg';

export const CollaborationsPage = (): ReactElement => {
  const [fetchedContents, setFetchedContents] = useState(true);
  const goToChat = (chatId: number): void => {
    routerStore.navigatePage(Page.COLLABORATIONS_CHAT, `chat/${chatId}`);
  };
  return (
    <>
      <Helmet>
        <meta name="description" content={'Collaboration dashboard'} />
        <title>Collaboration dashboard</title>
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
          {fetchedContents ? (
            <>
              <LeftPanel>
                <FlexWrapColumn>
                  <LeftPanelHeader variant={'h6'}>My datasets</LeftPanelHeader>
                  <List sx={{ width: '100%' }}>
                    <ListItemButton
                      sx={{ width: '100%', borderRadius: '8px' }}
                      onClick={() => setFetchedContents(false)}>
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
                <BodyWrap>
                  <BodyContentWrap>
                    <HeaderWrap>
                      <HeaderTitleWrap>
                        <Typography variant={'h5'}>
                          Collaboration dashboard
                        </Typography>
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
                      This page helps you manage collaboration requests from
                      data users who plan to reuse/include your data in their
                      upcoming publications.
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
                    <CollaborationRequestBox
                      onClick={() => goToChat(1)}
                      avatar={'PL'}
                      name={'Peter Lidsky'}
                      status={CollaborationRequestBoxStatus.NEW}>
                      Mice brain control/ex fertilization RNA-seq data
                    </CollaborationRequestBox>
                    <HeightElement value={'24px'} />
                    <CollaborationRequestBox
                      onClick={() => goToChat(2)}
                      avatar={'MP'}
                      name={'Maria Petrova '}
                      status={CollaborationRequestBoxStatus.APPROVED}>
                      DNA damage in mice bone marrow cells after acute treatment
                      by restraint and olfactory stressors
                    </CollaborationRequestBox>
                    <HeightElement value={'24px'} />
                    <CollaborationRequestBox
                      onClick={() => goToChat(3)}
                      avatar={'MP'}
                      name={'John D. Gearhart'}
                      status={CollaborationRequestBoxStatus.DECLINED}>
                      Independent Evolution of RNA Structures in BRD2 and BRD3
                      Genes Governs Control of Unproductive Splicing
                    </CollaborationRequestBox>
                  </BodyContentWrap>
                </BodyWrap>
              </RightPanel>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxHeight: 'calc(100% - 195px)',
                margin: '0 auto'
              }}>
              <div style={{ textAlign: 'center' }}>
                <img src={NoPublicationsImage} />
                <h3>Download dataset to start collaboration</h3>
                <StyledButton variant="outlined" onClick={() => false}>
                  Main page →
                </StyledButton>
              </div>
            </div>
          )}
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

const StyledButton = styled(Button)`
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  &:hover {
    background: rgb(0 0 0 / 4%);
    border-color: #040036;
  }
`;
