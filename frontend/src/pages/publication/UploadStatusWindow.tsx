import React, { ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import { useWindowSize } from '../../util/useWindowSize';
import { FileSystemFA } from '../../fire-browser/FileSystemFA';
import useScrollPosition from '../../util/useScrollPosition';
import { observer } from 'mobx-react-lite';
import {
  CheckCircle,
  Close,
  InsertDriveFile,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import { CircularProgress, IconButton, Link, Stack } from '@mui/material';

export const UploadStatusWindow = observer(
  (props: { fs: FileSystemFA }): ReactElement | null => {
    const { fs } = props;
    const [windowWidth, windowHeight] = useWindowSize();
    const scrollPosition = useScrollPosition();

    const count = fs.uploadProgress.count;
    const inProgress = fs.uploadProgress.inProgress;

    let overallProgress: number = 0;
    [...fs.uploadProgress.progressMetadata.keys()].forEach((key) => {
      const value = fs.uploadProgress.progressMetadata.get(key);
      overallProgress += value?.metadata.progress ?? 0;
    });
    overallProgress = Math.floor((overallProgress * 100) / count);

    const [isMinimized, setIsMinimized] = useState(false);

    const hasInProgress = inProgress !== 0;

    if (fs.uploadProgress.count === 0) {
      return null;
    }

    return (
      <UploadStatusWrap
        style={{
          position: 'absolute',
          top:
            windowHeight +
            scrollPosition -
            (isMinimized ? 0 : 250) -
            80 -
            (!hasInProgress ? 0 : isMinimized ? 0 : 32),
          left: windowWidth - 400 - 16
        }}>
        <>
          <UploadStatusHead>
            {hasInProgress && <>Uploading {inProgress} items</>}
            {!hasInProgress && <>{count} uploads completed </>}
            <UploadStatusHeadActions>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={() => setIsMinimized((v) => !v)}>
                  {!isMinimized && <KeyboardArrowDown />}
                  {isMinimized && <KeyboardArrowUp />}
                </IconButton>
                <IconButton
                  disabled={hasInProgress}
                  onClick={fs.uploadProgress.clear}>
                  <Close />
                </IconButton>
              </Stack>
            </UploadStatusHeadActions>
          </UploadStatusHead>
          {!isMinimized && (
            <>
              {inProgress !== 0 && (
                <UploadStatusPercent>
                  {overallProgress}% uploaded...
                  <UploadStatusCancel>
                    <LinkWrap>Cancel</LinkWrap>
                  </UploadStatusCancel>
                </UploadStatusPercent>
              )}
              <UploadStatusBody>
                {[...fs.uploadProgress.progressMetadata.keys()].map((key) => {
                  const value = fs.uploadProgress.progressMetadata.get(key);
                  if (!value) {
                    return null;
                  }
                  const progress: number = Math.floor(
                    (value.metadata.progress ?? 0) * 100
                  );
                  return (
                    <UploadStatusEntry key={key}>
                      <InsertDriveFile />
                      <UploadStatusName>{value.fileName}</UploadStatusName>
                      <UploadStatus>
                        {progress !== 100 && (
                          <CircularProgress
                            size={16}
                            variant={'determinate'}
                            value={progress}
                          />
                        )}
                        {progress === 100 && (
                          <CheckCircle fontSize={'small'} color={'success'} />
                        )}
                      </UploadStatus>
                    </UploadStatusEntry>
                  );
                })}
              </UploadStatusBody>
            </>
          )}
        </>
      </UploadStatusWrap>
    );
  }
);

const UploadStatusWrap = styled.div`
  border-radius: 4px 4px 0px 0px;
  background: var(--primary-contrast, #fff);
  /* elevation/3 */
  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
  width: 400px;
  max-width: 400px;
`;

const UploadStatusHead = styled.div`
  padding: 12px 16px;

  background: var(--grey-100, #f3f2f5);

  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  display: flex;
  align-items: center;
`;

const UploadStatusHeadActions = styled.div`
  margin-left: auto;

  display: flex;
`;

const UploadStatusPercent = styled.div`
  padding: 4px 16px;

  background: var(--primary-states-hover, rgba(59, 78, 255, 0.04));

  display: flex;

  align-items: center;
`;

const UploadStatusCancel = styled.div`
  margin-left: auto;

  display: flex;
`;

const UploadStatusEntry = styled.div`
  padding: 8px 16px;

  display: flex;

  align-items: center;
`;

const UploadStatusName = styled.div`
  margin-left: 12px;

  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;
`;

const LinkWrap = styled(Link)`
  cursor: pointer;
`;

const UploadStatus = styled.div`
  margin-left: auto;

  display: flex;
`;

const UploadStatusBody = styled.div`
  min-height: 250px;
  max-height: 250px;
  overflow-y: scroll;
`;
