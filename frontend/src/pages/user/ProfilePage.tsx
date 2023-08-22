import React, { type FunctionComponent } from 'react';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  Logo,
  Parent
} from '../common.styled';
import { routerStore } from '../../core/router';
import { observer } from 'mobx-react-lite';
import { UserMenu } from '../../components/UserMenu';
import logo from '../../assets/logo.svg';

export const ProfilePage: FunctionComponent = observer(() => {
  return (
    <Parent>
      <FlexHeader>
        <Logo onClick={routerStore.goHome}>
          <img src={logo} />
        </Logo>
        <FlexHeaderRight>
          <UserMenu />
        </FlexHeaderRight>
      </FlexHeader>
      <FlexBodyCenter>
        <FlexBody>Placeholder for Profile Page</FlexBody>
      </FlexBodyCenter>
    </Parent>
  );
});
