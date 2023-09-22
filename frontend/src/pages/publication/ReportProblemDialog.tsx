import React, { ReactElement, useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Close, CopyAllOutlined } from '@mui/icons-material';
import DialogContent from '@mui/material/DialogContent';
import { TitleRowWrap } from '../common.styled';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { observer } from 'mobx-react-lite';
import { Button, Link, TextField } from '@mui/material';
import { getAllFileEntries } from '../../util/fileUtil';
import UploadDocument from './../../assets/upload-document.svg';

export const ReportProblemDialog = observer(
  (props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  }): ReactElement => {
    const { isOpen, setIsOpen } = props;

    const [isDropZoneVisible, setIsDropZoneVisible] = useState(true);

    useEffect(() => {
      let lastTarget: EventTarget | null = null;

      window.addEventListener('dragenter', function (e) {
        lastTarget = e.target;
        setIsDropZoneVisible(true);
      });

      window.addEventListener('dragleave', function (e) {
        if (e.target === lastTarget || e.target === document) {
          setIsDropZoneVisible(false);
        }
      });
    }, []);

    const onDrop = async (e: {
      preventDefault: () => void;
      stopPropagation: () => void;
      dataTransfer: { items: DataTransferItemList };
    }): Promise<void> => {
      console.log('result');
      e.preventDefault();
      e.stopPropagation();
      const result = await getAllFileEntries(e.dataTransfer.items);
      console.log(result);
      setIsDropZoneVisible(false);
    };

    const onDragOver = (e: any): void => {
      e.stopPropagation();
      e.preventDefault();
    };

    const onClose = (): void => {
      setIsOpen(false);
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
                fontSize: 20,
                fontWeight: 500,
                display: 'flex',
                alignContent: 'center'
              }}
              id="alert-dialog-title">
              <WarningAmber
                style={{
                  width: 32,
                  height: 32,
                  marginRight: 16
                }}></WarningAmber>
              Report a problem
            </DialogTitle>
            <Close
              onClick={onClose}
              style={{
                cursor: 'pointer'
              }}
              htmlColor={'#68676E'}
            />
          </TitleRowWrap>
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
              <FullWidthTextField
                variant="outlined"
                label={'Your contact email'}
              />
              <FullWidthTextField
                multiline
                rows={4}
                variant="outlined"
                label={'Describe the problem that you have faced...'}
              />
              {isDropZoneVisible && (
                <DropZone onDragOver={onDragOver} onDrop={onDrop}>
                  <img src={UploadDocument} />
                  <div style={{ fontSize: 16 }}>
                    <Link>Click to upload</Link> or drag and drop a screenshot
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: '#68676E',
                      marginTop: 8
                    }}>
                    SVG, PNG, JPG or GIF (max. 3MB)
                  </div>
                </DropZone>
              )}
            </div>
            <ButtonWrap variant="contained" onClick={() => {}}>
              <CopyAllOutlined style={{ marginRight: '12px' }} />
              Copy citation
            </ButtonWrap>
          </DialogContent>
        </DialogContentWrap>
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

const DropZone = styled('div')`
  margin-top: 32px;
  border-radius: 4px;
  border: 1px dashed var(--divider, #d2d2d6);
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 152px;

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
`;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-top: 32px;
`;
