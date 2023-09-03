import React, {
  type FunctionComponent,
  useEffect,
  useRef,
  useState
} from 'react';
import { getAllFileEntries } from 'src/util/fileUtil';
import styled from '@emotion/styled';
import {
  type ChonkyFileSystem,
  DuplicateCheckResult
} from './ChonkyFileSystem';
import { observer } from 'mobx-react-lite';
import { UploadType } from '../apis/first-approval-api';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FileBrowser } from './FileBrowser';

interface FileUploaderProps {
  isReadonly: boolean;
  onArchiveDownload: () => void;
  fs: ChonkyFileSystem;
}

export const FileUploader: FunctionComponent<FileUploaderProps> = observer(
  (props: FileUploaderProps) => {
    const { fs } = props;
    const [isDropZoneVisible, setIsDropZoneVisible] = useState(false);
    const isChonkyDragRef = useRef(false);
    const [dialogRadioButtonValue, setDialogRadioButtonValue] = useState(
      UploadType.REPLACE
    );

    useEffect(() => {
      let lastTarget: EventTarget | null = null;

      window.addEventListener('dragenter', function (e) {
        if (!isChonkyDragRef.current) {
          lastTarget = e.target;
          setIsDropZoneVisible(true);
        }
      });

      window.addEventListener('dragleave', function (e) {
        if (
          !isChonkyDragRef.current &&
          (e.target === lastTarget || e.target === document)
        ) {
          setIsDropZoneVisible(false);
        }
      });
    }, []);

    const onDrop = async (e: {
      preventDefault: () => void;
      stopPropagation: () => void;
      dataTransfer: { items: DataTransferItemList };
    }): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();
      const result = await getAllFileEntries(e.dataTransfer.items);

      void props.fs
        .hasDuplicatesInCurrentFolder(
          result.map((i) => i.name),
          result[0].isDirectory
        )
        .then((hasDuplicates) => {
          if (hasDuplicates === DuplicateCheckResult.ROOT_NAME_ALREADY_EXISTS) {
            props.fs.addDirectoryImpossibleDialogOpen = true;
          } else if (
            hasDuplicates ===
            DuplicateCheckResult.ONE_OR_MORE_FILE_ALREADY_EXISTS
          ) {
            props.fs.renameOrReplaceDialogOpen = true;
            props.fs.renameOrReplaceDialogCallback = (
              uploadType: UploadType
            ) => {
              fs.addFilesDnd(result, uploadType);
              setIsDropZoneVisible(false);
              props.fs.renameOrReplaceDialogOpen = false;
            };
          } else {
            fs.addFilesDnd(result, UploadType.REPLACE);
            setIsDropZoneVisible(false);
          }
        });
    };

    return (
      <Wrap>
        {isDropZoneVisible && (
          <DropZone onDrop={onDrop}>Drag files here for upload</DropZone>
        )}
        <FileBrowser
          fs={fs}
          isChonkyDragRef={isChonkyDragRef}
          isReadonly={props.isReadonly}
          onArchiveDownload={props.onArchiveDownload}
        />
        <Dialog
          open={props.fs.renameOrReplaceDialogOpen}
          onClose={props.fs.closeReplaceOrRenameDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContentWrap>
            <DialogTitle id="alert-dialog-title">Upload options</DialogTitle>
            <DialogContent>
              <ContentWrap>
                <TextWrap>
                  One or more items already exists in this location. Do you want
                  to replace the existing items with a new version or keep both
                  items?
                </TextWrap>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={dialogRadioButtonValue}
                  onChange={(e) => {
                    setDialogRadioButtonValue(e.target.value as UploadType);
                  }}
                  name="radio-buttons-group">
                  <FormControlLabel
                    value={UploadType.REPLACE}
                    control={<Radio />}
                    label="Replace existing file"
                  />
                  <FormControlLabel
                    value={UploadType.RENAME}
                    control={<Radio />}
                    label="Keep all items"
                  />
                </RadioGroup>
              </ContentWrap>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  props.fs.closeReplaceOrRenameDialog();
                  setIsDropZoneVisible(false);
                }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  props.fs.renameOrReplaceDialogCallback(
                    dialogRadioButtonValue
                  );
                  setIsDropZoneVisible(false);
                }}>
                Upload
              </Button>
            </DialogActions>
          </DialogContentWrap>
        </Dialog>
        <Dialog
          open={props.fs.addDirectoryImpossibleDialogOpen}
          onClose={props.fs.closeAddDirectoryImpossibleDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContentWrap>
            <DialogTitle id="alert-dialog-title">Upload options</DialogTitle>
            <DialogContent>
              <ContentWrap>
                <TextWrap>
                  The name of the folder you are trying to add is already in
                  use. Rename and try again.
                </TextWrap>
              </ContentWrap>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  props.fs.closeAddDirectoryImpossibleDialog();
                  setIsDropZoneVisible(false);
                }}>
                Ok
              </Button>
            </DialogActions>
          </DialogContentWrap>
        </Dialog>
        <Dialog
          open={props.fs.moveFilesImpossibleDialogOpen}
          onClose={props.fs.closeMoveFilesImpossibleDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogContentWrap>
            <DialogTitle id="alert-dialog-title">Upload options</DialogTitle>
            <DialogContent>
              <ContentWrap>
                <TextWrap>
                  The name of the folder you are trying to move is already in
                  use is destination folder. Rename and try again.
                </TextWrap>
              </ContentWrap>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  props.fs.closeMoveFilesImpossibleDialog();
                  setIsDropZoneVisible(false);
                }}>
                Ok
              </Button>
            </DialogActions>
          </DialogContentWrap>
        </Dialog>
      </Wrap>
    );
  }
);

const Wrap = styled('div')`
  margin-top: 48px;
  margin-bottom: 40px;
`;

const DropZone = styled('div')`
  border-radius: 4px;
  border: 2px dashed var(--divider, #d2d2d6);
  background: var(--primary-states-selected, rgba(59, 78, 255, 0.08));
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 424px;

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
`;

const ContentWrap = styled.div`
  padding-top: 8px;
`;

const TextWrap = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
`;

const DialogContentWrap = styled.div`
  padding: 16px 32px 32px 16px !important;
`;
