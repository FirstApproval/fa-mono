import React, { type FunctionComponent, useState } from 'react';
import { Box, Link, Typography } from "@mui/material"
import { FlexBodyJustifyContentCenterAlignItemsCenter, FlexWrapRow, Parent } from "../common.styled"
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { Footer } from '../home/Footer';
import { BetaDialog } from '../../components/BetaDialog';
import { HeaderComponent } from '../../components/HeaderComponent';
import { DownloadersDialog } from '../publication/DownloadersDialog';
import { downloadersStore } from '../publication/store/downloadsStore';
import { OpenInNewOutlined } from "@mui/icons-material"

export const ContactsPage: FunctionComponent = observer(() => {
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(() => false);

  return (
    <>
      <Parent>
        <BetaBannerWrap>
          <Link
            color="inherit"
            href={'/contest'}
            underline="none"
            target={'_blank'}>
            <FlexBodyJustifyContentCenterAlignItemsCenter>
              <BetaHeaderText variant={'subtitle1'}>
                Participate in the Student Biological Data Competition
              </BetaHeaderText>
              <OpenInNewOutlined sx={{
                width: '20px',
                height: '20px',
                color: 'white'
              }}/>
            </FlexBodyJustifyContentCenterAlignItemsCenter>
          </Link>
        </BetaBannerWrap>
        <BetaDialog
          isOpen={isBetaDialogOpen}
          onClose={() => setIsBetaDialogOpen(false)}
        />
        <HeaderComponent
          showAboutUsButton={true}
          showPublishButton={true}
          showLoginButton={true}
          showSignUpContainedButton={true}
        />
        <Box sx={{ flexGrow: 1 }}>
          <ContentWrap>
            <InnerContentWrap>
              <div style={{ marginBottom: 16 }}>FIRST APPROVAL INC.</div>
              <div style={{ marginBottom: 16 }}>
                Address: 254 Chapman Rd, Ste 208 #14685 Newark, Delaware 19702
                USA
              </div>
              <div style={{ marginBottom: 16 }}>
                Support & QA:{' '}
                <a href={'mailto:info@firstapproval.io'}>
                  info@firstapproval.io
                </a>{' '}
              </div>
              <div>
                Scientific partnerships:{' '}
                <a href={'mailto:tim@firstapproval.io'}>Dr. Tim Glinin</a>{' '}
              </div>
              <div>
                Business partnerships:{' '}
                <a href={'mailto:anastasia@firstapproval.io'}>
                  Anastasia Shubina
                </a>{' '}
              </div>
              <div>
                Technical questions and engineering:{' '}
                <a href={'mailto:sergei@firstapproval.io'}>Sergei Frolov</a>{' '}
              </div>
            </InnerContentWrap>
          </ContentWrap>
        </Box>
      </Parent>
      <Footer />
      <DownloadersDialog
        isOpen={downloadersStore.open}
        downloaders={downloadersStore.downloaders}
      />
    </>
  );
});

const BetaBannerWrap = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  background-color: var(--primary-main, #3b4eff);
  justify-content: center;
  align-items: center;
  align-content: center;
  cursor: pointer;

  padding: 8px 24px;

  @media (min-width: 768px) {
    padding: 12px 32px;
  }
`;

const ContentWrap = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 24px 0px 24px;
`;

const InnerContentWrap = styled('div')`
  width: 400px;
  font-size: 16px;

  @media (max-width: 500px) {
    width: 300px;
  }
`;

const BetaHeaderText = styled(Typography)`
  color: var(--primary-contrast, #fff);
  text-align: center;
  margin-left: 12px;
  margin-right: 12px;
`;
