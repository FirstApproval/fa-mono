import React, { type FunctionComponent } from 'react';
import styled from '@emotion/styled';
import {
  FlexBodyCenter,
  FullWidthButton,
  Header,
  Parent
} from '../common.styled';
import { routerStore } from '../../core/router';
import { Page } from '../../core/RouterStore';
import { HeaderComponent } from '../../components/HeaderComponent';
import { WorkplacesEditor } from '../../components/WorkplacesEditor';
import { userStore } from '../../core/user';
import { observer } from 'mobx-react-lite';

export const EnterSelfInfoPage: FunctionComponent = observer(() => {
  const finishRegistration = async (): Promise<void> => {
    await userStore.saveWorkplaces(userStore.workplaces).then(() => {
      routerStore.navigatePage(Page.HOME_PAGE);
    });
  };

  return (
    <Parent>
      <HeaderComponent />
      <FlexBodyCenter>
        <FlexBody>
          <Header>{'Almost there!\nList your current workplaces:'}</Header>
          <WorkplacesEditor showSaveButton={false} />
          <FullWidthButton
            variant="contained"
            size={'large'}
            onClick={async () => await finishRegistration()}>
            Finish registration
          </FullWidthButton>
        </FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
});
export const FlexBody = styled.div`
  width: 500px !important;
`;
