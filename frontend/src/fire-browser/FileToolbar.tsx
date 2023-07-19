import React, { type ReactElement } from 'react';
import {
  ChonkyActions,
  selectFileActionData,
  selectSelectedFiles,
  selectSelectionSize,
  useFileActionTrigger,
  useLocalizedFileActionStrings,
  useParamSelector
} from '@first-approval/chonky';
import { Button, Divider, IconButton } from '@mui/material';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditNote,
  FileUploadOutlined,
  FolderOpen
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/display-name
export const FileToolbar: React.FC = React.memo(() => {
  const selectionSize = useSelector(selectSelectionSize);
  const selectedFiles = useSelector(selectSelectedFiles);
  const hasFolderSelection = !!selectedFiles.find((f) => f.isDir);

  return (
    <>
      <ToolbarWrap>
        <input
          type="file"
          id="file-input"
          multiple
          style={{ display: 'none' }}
        />
        <MainAction
          item={ChonkyActions.UploadFiles.id}
          icon={<FileUploadOutlined />}
        />
        <ButtonWrap>
          <MainAction
            item={ChonkyActions.CreateFolder.id}
            icon={<FolderOpen />}
          />
        </ButtonWrap>
        {selectionSize !== 0 && (
          <>
            <DividerWrap variant={'middle'} orientation={'vertical'} />
            <SelectedCountWrap>{selectionSize} selected:</SelectedCountWrap>
          </>
        )}
        {selectionSize === 1 && (
          <FileAction item={ChonkyActions.AddNote.id} icon={<EditNote />} />
        )}
        {selectionSize !== 0 && (
          <>
            {!hasFolderSelection && (
              <FileAction
                item={ChonkyActions.DownloadFiles.id}
                icon={<DownloadOutlined />}
              />
            )}

            <FileAction
              item={ChonkyActions.DeleteFiles.id}
              icon={<DeleteOutlined />}
            />
          </>
        )}
        <ToolbarLeft></ToolbarLeft>
      </ToolbarWrap>
      <Divider />
    </>
  );
});

interface ToolbarButtonProps {
  item: string;
  icon: ReactElement;
}

const MainAction: React.FC<ToolbarButtonProps> = (
  props: ToolbarButtonProps
) => {
  const { item } = props;
  const action = useParamSelector(selectFileActionData, item);
  const triggerAction = useFileActionTrigger(item);
  const { buttonName } = useLocalizedFileActionStrings(action);
  const key = `toolbar-item-${item}`;
  return (
    <Button
      key={key}
      onClick={triggerAction}
      variant={'outlined'}
      startIcon={props.icon}>
      {buttonName}
    </Button>
  );
};

const FileAction: React.FC<ToolbarButtonProps> = (
  props: ToolbarButtonProps
) => {
  const { item } = props;

  const triggerAction = useFileActionTrigger(item);
  return <IconButton onClick={triggerAction}>{props.icon}</IconButton>;
};

const ToolbarWrap = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  height: 40px;
  min-height: 40px;
`;

const ToolbarLeft = styled.div`
  display: flex;
  margin-left: auto;
`;

const ButtonWrap = styled.div`
  margin-left: 24px;
`;

const SelectedCountWrap = styled.div`
  margin-left: 12px;
  margin-right: 8px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
`;

const DividerWrap = styled(Divider)`
  margin-left: 16px;
`;
