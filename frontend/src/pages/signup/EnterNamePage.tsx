import { type FunctionComponent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward } from '@mui/icons-material';
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

interface EnterNamePageProps {
  store: SignUpStore;
  onSignInClick: () => void;
  onContinueClick: () => void;
}

export const EnterNamePage: FunctionComponent<EnterNamePageProps> = observer(
  (props: EnterNamePageProps) => {
    const [isValidFirstName, setIsValidFirstName] = useState(true);
    const [isValidLastName, setIsValidLastName] = useState(true);

    const validate = (): boolean => {
      const isFN = props.store.firstName.length > 0;
      const isLN = props.store.lastName.length > 0;
      setIsValidFirstName(isFN);
      setIsValidLastName(isLN);
      return isFN && isLN;
    };

    const nameNonEmpty =
      props.store.firstName.length > 0 && props.store.lastName.length > 0;

    return (
      <Parent>
        <FlexHeader>
          <Logo onClick={routerStore.goHome}>First Approval</Logo>
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
            <Header>Welcome</Header>
            <EmailLabel>To start, what&apos;s your name?</EmailLabel>
            <div>
              <FullWidthTextField
                autoFocus
                error={!isValidFirstName}
                helperText={!isValidFirstName ? 'Enter valid name' : undefined}
                value={props.store.firstName}
                onChange={(e) => {
                  props.store.firstName = e.currentTarget.value;
                }}
                label="Name"
                variant="outlined"
              />
            </div>
            <div>
              <FullWidthTextField
                error={!isValidLastName}
                helperText={!isValidLastName ? 'Enter valid name' : undefined}
                value={props.store.lastName}
                onChange={(e) => {
                  props.store.lastName = e.currentTarget.value;
                }}
                label="Surname"
                variant="outlined"
              />
            </div>
            <FullWidthButton
              disabled={!nameNonEmpty}
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={() => {
                const isValid = validate();
                if (isValid) {
                  props.onContinueClick();
                }
              }}>
              Continue
            </FullWidthButton>
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
    );
  }
);

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`;

const EmailLabel = styled('div')`
  margin-top: 24px;
  margin-bottom: 24px;
`;
