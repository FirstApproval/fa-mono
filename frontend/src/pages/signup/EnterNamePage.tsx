import React, { type FunctionComponent, useState } from 'react';
import { TextField } from '@mui/material';
import styled from '@emotion/styled';
import { ArrowForward, InfoOutlined } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  FlexBody,
  FlexBodyCenter,
  FullWidthButton,
  Header,
  HeightElement,
  Parent,
  PrefilledDetails,
  PrefilledDetailsText
} from '../common.styled';
import { HeaderComponent } from '../../components/HeaderComponent';
import { C0288D1 } from '../../ui-kit/colors';

interface EnterNamePageProps {
  firstName: string;
  lastName: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  onContinueClick: () => void;
  isOauth: boolean;
  isPrefilledFullName: boolean;
}

export const EnterNamePage: FunctionComponent<EnterNamePageProps> = observer(
  (props: EnterNamePageProps) => {
    const {
      firstName,
      lastName,
      setFirstName,
      setLastName,
      onContinueClick,
      isOauth,
      isPrefilledFullName
    } = props;
    const [isValidFirstName, setIsValidFirstName] = useState(true);
    const [isValidLastName, setIsValidLastName] = useState(true);

    const validate = (): boolean => {
      const isFN = firstName.length > 0;
      const isLN = lastName.length > 0;
      setIsValidFirstName(isFN);
      setIsValidLastName(isLN);
      return isFN && isLN;
    };

    const nameNonEmpty = firstName.length > 0 && lastName.length > 0;

    const validateAndConfirm = (event: any): void => {
      if (event.key === 'Enter' || event.keyCode === 13 || event.button === 0) {
        event.preventDefault();
        const isValid = validate();
        if (isValid) {
          onContinueClick();
        }
      }
    };

    const showPrefilledDetailsText = !isOauth && isPrefilledFullName;

    return (
      <Parent>
        <HeaderComponent showLoginOutlinedButton={false} />
        <FlexBodyCenter>
          <FlexBody>
            <Header>Welcome</Header>
            {showPrefilledDetailsText && (
              <>
                <PrefilledDetails>
                  <InfoOutlined htmlColor={C0288D1} sx={{ marginTop: '7px' }} />
                  <PrefilledDetailsText variant={'body2'}>
                    We've pre-filled some details from previous co-author
                    credits on First Approval. Editing them here won’t affect
                    existing publications. Adjust as needed.
                  </PrefilledDetailsText>
                </PrefilledDetails>
                <HeightElement value={'32px'} />
              </>
            )}
            {!showPrefilledDetailsText && (
              <EmailLabel>To start, what&apos;s your name?</EmailLabel>
            )}
            <div>
              <FullWidthTextField
                autoComplete="given-name"
                autoFocus
                error={!isValidFirstName}
                helperText={!isValidFirstName ? 'Enter valid name' : undefined}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.currentTarget.value);
                }}
                onKeyDown={validateAndConfirm}
                label="First Name"
                variant="outlined"
              />
            </div>
            <div>
              <FullWidthTextField
                autoComplete="family-name"
                error={!isValidLastName}
                helperText={!isValidLastName ? 'Enter valid name' : undefined}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.currentTarget.value);
                }}
                onKeyDown={validateAndConfirm}
                label="Last Name"
                variant="outlined"
              />
            </div>
            <FullWidthButton
              disabled={!nameNonEmpty}
              variant="contained"
              size={'large'}
              endIcon={<ArrowForward />}
              onClick={validateAndConfirm}>
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
