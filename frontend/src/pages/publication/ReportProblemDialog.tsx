import React, { ReactElement, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Close } from '@mui/icons-material';
import DialogContent from '@mui/material/DialogContent';
import { FlexWrapRow, TitleRowWrap, WidthElement } from '../common.styled';
import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { observer } from 'mobx-react-lite';
import { Button, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { reportService } from '../../core/service';

export const ReportProblemDialog = observer(
  (props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    publicationId: string;
  }): ReactElement => {
    // const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { isOpen, setIsOpen, publicationId } = props;

    const [email, setEmail] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);

    const [touched, setTouched] = useState(false);

    const [loading, setLoading] = useState(false);

    // const [isDropZoneVisible, setIsDropZoneVisible] = useState(true);

    // const [files, setFiles] = useState<ReportFile[]>([]);

    // useEffect(() => {
    //   let lastTarget: EventTarget | null = null;
    //
    //   window.addEventListener('dragenter', function (e) {
    //     lastTarget = e.target;
    //     setIsDropZoneVisible(true);
    //   });
    //
    //   window.addEventListener('dragleave', function (e) {
    //     if (e.target === lastTarget || e.target === document) {
    //       setIsDropZoneVisible(false);
    //     }
    //   });
    // }, []);

    // const onDragOver = (e: any): void => {
    //   e.stopPropagation();
    //   e.preventDefault();
    // };

    const onClose = (): void => {
      setIsOpen(false);
    };

    // const handleFileChange = async (
    //   event: React.ChangeEvent<HTMLInputElement>
    // ): Promise<void> => {
    //   const filesInput = event.target.files;
    //   if (!filesInput) {
    //     return;
    //   }
    //   setFiles([]);
    //   for (const file of filesInput) {
    //     uploadFile(file);
    //   }
    // };

    // const onDrop = async (e: {
    //   preventDefault: () => void;
    //   stopPropagation: () => void;
    //   dataTransfer: { items: DataTransferItemList };
    // }): Promise<void> => {
    //   console.log('result');
    //   e.preventDefault();
    //   e.stopPropagation();
    //   const result = await getAllFileEntries(e.dataTransfer.items);
    //   setIsDropZoneVisible(false);
    //   if (!result) {
    //     return;
    //   }
    //   setFiles([]);
    //   for (const file of result) {
    //     (file as FileSystemFileEntry).file(async (f) => {
    //       uploadFile(f);
    //     });
    //   }
    // };
    //
    // const uploadFile = async (file: File): Promise<void> => {
    //   const tmpId = uuidv4().toString();
    //   setFiles([
    //     {
    //       tmpId: tmpId,
    //       name: file.name,
    //       loadProgress: 0
    //     },
    //     ...files
    //   ]);
    //   const res = await reportService.uploadReportFile(file.size, file, {
    //     onUploadProgress: (progressEvent: AxiosProgressEvent) => {
    //       if (progressEvent.total) {
    //         const percentCompleted = Math.round(
    //           (progressEvent.loaded * 100) / progressEvent.total
    //         );
    //         const fileList = [...files];
    //         fileList.find(
    //           (f: ReportFile): boolean => f.tmpId === tmpId
    //         )!.loadProgress = percentCompleted;
    //         setFiles(fileList);
    //       }
    //     }
    //   });
    //   const fileList = [...files];
    //   const loadedFile = fileList.find(
    //     (f: ReportFile): boolean => f.tmpId === tmpId
    //   );
    //   loadedFile!.loadProgress = 100;
    //   loadedFile!.id = res.data.id;
    //   setFiles(fileList);
    // };

    const submit = async (): Promise<void> => {
      setTouched(true);
      if (email && description) {
        setLoading(true);
        await reportService.createReport({
          email,
          description,
          publicationId,
          fileIds: []
        });
        setLoading(false);
        onClose();
      }
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
                error={touched && !email}
                label={'Your contact email'}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
              />
              <FullWidthTextField
                multiline
                rows={4}
                error={touched && !description}
                variant="outlined"
                label={'Describe the problem that you have faced...'}
                onChange={(e) => {
                  setDescription(e.currentTarget.value);
                }}
              />
              {/* {isDropZoneVisible && ( */}
              {/*   <DropZone onDragOver={onDragOver} onDrop={onDrop}> */}
              {/*     <input */}
              {/*       style={{ display: 'none' }} */}
              {/*       ref={fileInputRef} */}
              {/*       type="file" */}
              {/*       onChange={handleFileChange} */}
              {/*     /> */}
              {/*     <img src={UploadDocument} /> */}
              {/*     <div */}
              {/*       onClick={() => fileInputRef.current?.click()} */}
              {/*       style={{ fontSize: 16 }}> */}
              {/*       <Link style={{ cursor: 'pointer' }}>Click to upload</Link>{' '} */}
              {/*       or drag and drop a screenshot */}
              {/*     </div> */}
              {/*     <div */}
              {/*       style={{ */}
              {/*         fontSize: 14, */}
              {/*         color: '#68676E', */}
              {/*         marginTop: 8 */}
              {/*       }}> */}
              {/*       SVG, PNG, JPG or GIF (max. 3MB) */}
              {/*     </div> */}
              {/*   </DropZone> */}
              {/* )} */}
              {/* {files.map((f: ReportFile) => { */}
              {/*   return ( */}
              {/*     <div key={f.id ?? f.tmpId}> */}
              {/*       {f.name} {f.id} {f.loadProgress} */}
              {/*       <LinearProgress */}
              {/*         variant="determinate" */}
              {/*         value={f.loadProgress}></LinearProgress> */}
              {/*     </div> */}
              {/*   ); */}
              {/* })} */}
            </div>
            <ConfirmDialogActions style={{ marginTop: 32 }}>
              <FlexWrapRow>
                <CancelButton
                  color={'primary'}
                  variant="text"
                  size={'large'}
                  onClick={onClose}>
                  Cancel
                </CancelButton>
                <WidthElement value={'24px'} />
                <ConfirmButton
                  size={'large'}
                  disabled={loading}
                  variant={'contained'}
                  onClick={() => {
                    submit();
                  }}>
                  Send
                </ConfirmButton>
              </FlexWrapRow>
            </ConfirmDialogActions>
          </DialogContent>
        </DialogContentWrap>
      </Dialog>
    );
  }
);

// interface ReportFile {
//   tmpId?: string;
//   id?: string;
//   name: string;
//   loadProgress: number;
// }

const DialogContentWrap = styled.div`
  padding: 32px !important;
  width: 600px;
`;

// const DropZone = styled('div')`
//   margin-top: 32px;
//   border-radius: 4px;
//   border: 1px dashed var(--divider, #d2d2d6);
//   margin-bottom: 40px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   min-height: 152px;
//
//   font-size: 20px;
//   font-style: normal;
//   font-weight: 400;
// `;

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-top: 32px;
`;

const ConfirmDialogActions = styled(DialogActions)`
  padding: 0;
  display: flex;
  align-items: end;
`;

const CancelButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 11px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ConfirmButton = styled(Button)`
  display: flex;
  height: 48px;
  padding: 8px 22px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: var(--error-contrast, #fff);
`;
