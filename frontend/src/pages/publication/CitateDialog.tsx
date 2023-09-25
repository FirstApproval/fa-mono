import React, { ReactElement, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Close, CopyAllOutlined } from '@mui/icons-material';
import DialogContent from '@mui/material/DialogContent';
import { HeightElement, TitleRowWrap } from '../common.styled';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import { PublicationAuthorName } from './store/PublicationStore';
import { observer } from 'mobx-react-lite';
import { Alert, Button, Snackbar } from '@mui/material';

export const CitateDialog = observer(
  (props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    authorNames: PublicationAuthorName[];
    publicationTime: Date | null;
    publicationTitle: string;
  }): ReactElement => {
    const {
      isOpen,
      setIsOpen,
      authorNames,
      publicationTime,
      publicationTitle
    } = props;

    const onClose = (): void => {
      setIsOpen(false);
    };
    const [displayCiteCopiedAlert, setDisplayCiteCopiedAlert] = useState(false);

    const copyPublicationLinkToClipboard = async (): Promise<void> => {
      const text = authors() + authorsEtAl() + year() + title() + url();
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(text);
      } else {
        document.execCommand('copy', true, text);
      }
      setDisplayCiteCopiedAlert(true);
    };

    const authors = (): string => {
      return authorNames
        .slice(0, 4)
        .map((author) => {
          return author.lastName + ' ' + author.firstName.slice(0, 1) + '.';
        })
        .join(', ');
    };

    const authorsEtAl = (): string => {
      return authorNames.length > 4 ? ' et al.' : '';
    };

    const year = (): string => {
      if (!publicationTime) {
        return '';
      }
      return ` (${publicationTime.getFullYear().toString()}).`;
    };

    const title = (): string => {
      return ` ${publicationTitle} [Dataset]. First Approval.`;
    };

    const url = (): string => {
      return ` ${window.location.href}`;
    };

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContentWrap>
          <TitleRowWrap>
            <DialogTitle
              style={{
                padding: 0,
                fontSize: 24,
                fontWeight: 600
              }}
              id="alert-dialog-title">
              Cite this article
            </DialogTitle>
            <Close
              onClick={onClose}
              style={{
                cursor: 'pointer'
              }}
              htmlColor={'#68676E'}
            />
          </TitleRowWrap>
          <HeightElement value={'32px'} />
          <DialogContent
            style={{
              padding: 0,
              width: '100%'
            }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 400
              }}>
              <span>{authors()}</span>
              <span>{authorsEtAl()}</span>
              <span>{year()}</span>
              <span>{title()}</span>
              <span>{url()}</span>
            </div>
            <ButtonWrap
              variant="contained"
              onClick={copyPublicationLinkToClipboard}>
              <CopyAllOutlined style={{ marginRight: '12px' }} />
              Copy citation
            </ButtonWrap>
          </DialogContent>
        </DialogContentWrap>
        <Snackbar
          open={displayCiteCopiedAlert}
          autoHideDuration={4000}
          onClose={() => {
            setDisplayCiteCopiedAlert(false);
          }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Citation successfully copied!
          </Alert>
        </Snackbar>
      </Dialog>
    );
  }
);

const DialogContentWrap = styled.div`
  padding: 32px !important;
  width: 600px;
`;

const ButtonWrap = styled(Button)`
  margin-top: 32px;
  width: 182px;
  height: 40px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
`;
