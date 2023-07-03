import React, { type ReactElement } from 'react';
import {
  ChonkyActions,
  selectFileActionData,
  useFileActionProps,
  useFileActionTrigger,
  useLocalizedFileActionStrings,
  useParamSelector
} from '@first-approval/chonky';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  Add,
  FolderOpen,
  FormatListBulleted,
  GridView
} from '@mui/icons-material';
import styled from '@emotion/styled';

// eslint-disable-next-line react/display-name
export const FileToolbar: React.FC = React.memo(() => {
  return (
    <ToolbarWrap>
      <ToolbarButton
        item={ChonkyActions.CreateFolder.id}
        icon={<FolderOpen />}
      />
      <ToolbarLeft>
        <ToolbarButton item={ChonkyActions.UploadFiles.id} icon={<Add />} />
        <ToolbarToggleButton
          items={[
            {
              name: ChonkyActions.EnableListView.id,
              icon: <FormatListBulleted />
            },
            { name: ChonkyActions.EnableGridView.id, icon: <GridView /> }
          ]}
        />
      </ToolbarLeft>
    </ToolbarWrap>
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
  // const { icon, active, disabled } = useFileActionProps(item);
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

interface ToolbarToggleButtonProps {
  items: Array<{ name: string; icon: ReactElement }>;
}

const ToolbarToggleButton: React.FC<ToolbarToggleButtonProps> = (
  props: ToolbarToggleButtonProps
) => {
  const children: JSX.Element[] = [];
  let value;
  const actions: Record<string, () => any> = {};
  for (const item of props.items) {
    const itemName = item.name;
    // const action = useParamSelector(selectFileActionData, itemName);
    const triggerAction = useFileActionTrigger(itemName);
    const { active } = useFileActionProps(itemName);

    if (active) {
      value = itemName;
    }

    children.push(
      <ToggleButton value={itemName} key={itemName}>
        {item.icon}
      </ToggleButton>
    );
    actions[itemName] = triggerAction;
  }

  const control = {
    value,
    onChange: (e: any) => {
      actions[e.currentTarget.value]();
    },
    exclusive: true
  };

  return (
    <ToggleButtonGroupWrap size="small" {...control}>
      {children}
    </ToggleButtonGroupWrap>
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

const ToggleButtonGroupWrap = styled(ToggleButtonGroup)`
  margin-left: 24px;
`;
