import React, { type FunctionComponent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { type SignUpStore } from './SignUpStore';
import { observer } from 'mobx-react-lite';
import {
  FlexBody,
  FlexBodyCenter,
  FlexHeader,
  FlexHeaderRight,
  FullWidthButton,
  Logo,
  Parent,
  Header
} from '../common.styled';
import { routerStore } from '../../core/router';
import { userService } from '../../core/service';
import { Page } from '../../core/RouterStore';
import logo from '../../assets/logo.svg';

interface EnterSelfInfoPageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const EnterSelfInfoPage: FunctionComponent<EnterSelfInfoPageProps> =
  observer((props: EnterSelfInfoPageProps) => {
    const [selfInfo, setSelfInfo] = useState('');
    const finishRegistration = async (event: any): Promise<void> => {
      if (event.key === 'Enter' || event.keyCode === 13 || event.button === 0) {
        event.preventDefault();
        await userService.getMe().then((response) => {
          const user = response.data;
          void userService.updateUser({
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            username: user.username,
            selfInfo
          });
          routerStore.navigatePage(Page.HOME_PAGE);
        });
      }
    };

    return (
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>
            <img src={logo} />
          </Logo>
          <FlexHeaderRight>
            <Button
              variant="outlined"
              size={'large'}
              onClick={props.onSignInClick}>
              Sign in
            </Button>
          </FlexHeaderRight>
        </FlexHeader>
        <FlexBodyCenter>
          <FlexBody>
            <Header>Almost there! Tell us about yourself:</Header>
            <div>
              <FullWidthTextField
                multiline={true}
                minRows={4}
                maxRows={20}
                autoFocus
                value={selfInfo}
                onChange={(e) => {
                  setSelfInfo(e.currentTarget.value);
                }}
                onKeyDown={finishRegistration}
                label="Enter your current professional role and academic background..."
                variant="outlined"
              />
            </div>
            <FullWidthButton
              variant="contained"
              size={'large'}
              onClick={finishRegistration}>
              Finish registration
            </FullWidthButton>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
    );
  });

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;
