import React, { type ReactElement } from 'react';
import {
  ChonkyActions,
  selectFileActionData,
  useFileActionTrigger,
  useLocalizedFileActionStrings,
  useParamSelector
} from '@first-approval/chonky';
import { Button, Stack, Tooltip } from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import styled from '@emotion/styled';

export const FileToolbarView: React.FC<{
  instanceId: string;
  downloadDisabled: boolean;
  // eslint-disable-next-line react/display-name
}> = React.memo((props) => {
  return (
    <>
      <ToolbarWrap>
        <Stack direction="row" alignItems="center" spacing={2}>
          <MainAction
            item={ChonkyActions.DownloadFilesArchive.id}
            icon={<FileDownload />}
            actionDisabled={props.downloadDisabled}
          />

          <MainAction item={ChonkyActions.PreviewFilesModal.id} />
        </Stack>

        <ToolbarLeft></ToolbarLeft>
      </ToolbarWrap>
    </>
  );
});

interface ToolbarButtonProps {
  item: string;
  icon?: ReactElement;
  actionDisabled?: boolean;
}

const MainAction: React.FC<ToolbarButtonProps> = (
  props: ToolbarButtonProps
) => {
  const { item } = props;
  const action = useParamSelector(selectFileActionData, item);
  const triggerAction = useFileActionTrigger(item);
  const { buttonName } = useLocalizedFileActionStrings(action);
  const key = `toolbar-item-${item}`;
  if (!action) {
    return null;
  }
  if (props.actionDisabled) {
    return (
      <Tooltip title="Download will be available after publication">
        {/* NB! Tooltip will not work without span */}
        <span>
          <Button
            disabled={props.actionDisabled}
            key={key}
            onClick={triggerAction}
            variant={'outlined'}
            startIcon={props.icon}>
            {buttonName}
          </Button>
        </span>
      </Tooltip>
    );
  }
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
  align-items: center;

  margin-bottom: 16px;
`;

const ToolbarLeft = styled.div`
  display: flex;
  margin-left: auto;
`;
