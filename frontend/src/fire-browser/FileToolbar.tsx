import React, { type ReactElement } from 'react';
import {
  ChonkyActions,
  selectFileActionData,
  useFileActionTrigger,
  useLocalizedFileActionStrings,
  useParamSelector
} from '@first-approval/chonky';
import { Button, Divider } from '@mui/material';
import { FileUploadOutlined, FolderOpen } from '@mui/icons-material';
import styled from '@emotion/styled';

// eslint-disable-next-line react/display-name
export const FileToolbar: React.FC = React.memo(() => {
  return (
    <>
      <ToolbarWrap>
        <input
          type="file"
          id="file-input"
          multiple
          style={{ display: 'none' }}
        />
        <ToolbarButton
          item={ChonkyActions.UploadFiles.id}
          icon={<FileUploadOutlined />}
        />
        <ButtonWrap>
          <ToolbarButton
            item={ChonkyActions.CreateFolder.id}
            icon={<FolderOpen />}
          />
        </ButtonWrap>

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

const ToolbarButton: React.FC<ToolbarButtonProps> = (
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

const ToolbarWrap = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ToolbarLeft = styled.div`
  display: flex;
  margin-left: auto;
`;

const ButtonWrap = styled.div`
  margin-left: 24px;
`;
