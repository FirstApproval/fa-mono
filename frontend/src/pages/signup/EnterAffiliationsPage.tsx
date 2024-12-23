import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import {
  FlexBodyCenter,
  HeightElement,
  Parent,
  PrefilledDetails,
  PrefilledDetailsText,
  WidthElement
} from '../common.styled';
import { routerStore } from '../../core/router';
import { HeaderComponent } from '../../components/HeaderComponent';
import {
  ActionButtonType,
  WorkplacesEditor
} from '../../components/WorkplacesEditor';
import { userStore } from '../../core/user';
import { observer } from 'mobx-react-lite';
import { Page } from '../../core/router/constants';
import { ArrowForward, Close, InfoOutlined } from '@mui/icons-material';
import { Flex, FlexAlignItems, FlexJustifyContent } from '../../ui-kit/flex';
import { CircularProgress, Typography } from '@mui/material';
import { C0288D1, C68676E } from '../../ui-kit/colors';

interface EnterAffiliationsPageProps {
  isRegistration: boolean;
  onContinueClick: () => void
}

export const EnterAffiliationsPage = observer(
  (props: EnterAffiliationsPageProps): ReactElement => {
    const { user } = userStore;
    if (!user) {
      return <CircularProgress />;
    }

    const showPrefilledDetailsText =
      !user.isWorkplacesConfirmed && user.workplaces.length > 0;
    return (
      <Parent>
        <HeaderComponent />
        <FlexBodyCenter>
          <FlexBody>
            {!props.isRegistration && (
              <Flex
                justifyContent={FlexJustifyContent.flexEnd}
                alignItems={FlexAlignItems.center}>
                <Close
                  onClick={() => routerStore.navigatePage(Page.HOME_PAGE)}
                  sx={{ width: '35px', height: '35px', cursor: 'pointer' }}
                  htmlColor={C68676E}
                />
              </Flex>
            )}
            <Header>
              {props.isRegistration
                ? 'Almost there!\nList your current affiliations:'
                : 'Before the start,\n' + 'List your current affiliations:'}
            </Header>
            <HeightElement value={showPrefilledDetailsText ? '16px' : '20px'} />
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
            <WorkplacesEditor
              isModalWindow={false}
              store={userStore}
              buttonType={ActionButtonType.FULL_WIDTH_CONFIRM}
              saveButtonText={
                props.isRegistration ? (
                  <div>Finish registration</div>
                ) : (
                  <Flex
                    justifyContent={FlexJustifyContent.center}
                    alignItems={FlexAlignItems.center}>
                    Continue
                    <WidthElement value={'8px'} />
                    <ArrowForward />
                  </Flex>
                )
              }
              saveCallback={async (workplaces): Promise<boolean> => {
                const isValid = userStore.validate();
                if (isValid) {
                  return userStore
                    .updateUser(workplaces, false, true)
                    .then(() => {
                      props.onContinueClick();
                      return true;
                    });
                }
                return Promise.resolve(isValid);
              }}
            />
            {!props.isRegistration && (
              <YouCanChangeItLater variant={'body2'}>
                You can change it later
              </YouCanChangeItLater>
            )}
          </FlexBody>
        </FlexBodyCenter>
      </Parent>
    );
  }
);
export const FlexBody = styled.div`
  width: 500px !important;
`;

export const YouCanChangeItLater = styled(Typography)`
  margin-top: 8px;
  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
`;

export const Header = styled.div`
  font-weight: 700;
  font-size: 48px;
  white-space: pre-line;
`;
