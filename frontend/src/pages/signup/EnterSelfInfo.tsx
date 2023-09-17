import React, { type FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { FlexBodyCenter, Header, Parent } from '../common.styled';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';
import { HeaderComponent } from '../../components/HeaderComponent';
import {
  ActionButtonType,
  WorkplacesEditor
} from '../../components/WorkplacesEditor';
import { userStore } from '../../core/user';
import { observer } from 'mobx-react-lite';

export const EnterSelfInfoPage: FunctionComponent = observer(() => {
  return (
    <Parent>
      <HeaderComponent />
      <FlexBodyCenter>
        <FlexBody>
          <Header>{'Almost there!\nList your current workplaces:'}</Header>
          <WorkplacesEditor
            store={userStore}
            buttonType={ActionButtonType.FULL_WIDTH_CONFIRM}
            saveButtonText={'Finish registration'}
            saveCallback={async (workplaces): Promise<void> =>
              userStore.saveWorkplaces(workplaces).then(() => {
                routerStore.navigatePage(Page.HOME_PAGE);
              })
            }
          />
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
});
export const FlexBody = styled.div`
  width: 500px !important;
`;
