import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { FlexBodyCenter, Header, Parent, WidthElement } from '../common.styled';
import { routerStore } from '../../core/router';
import { HeaderComponent } from '../../components/HeaderComponent';
import {
  ActionButtonType,
  WorkplacesEditor
} from '../../components/WorkplacesEditor';
import { userStore } from '../../core/user';
import { observer } from 'mobx-react-lite';
import { Page } from '../../core/router/constants';
import { ArrowForward, Close } from '@mui/icons-material';
import { Flex, FlexAlignItems, FlexJustifyContent } from '../../ui-kit/flex';
import { Typography } from '@mui/material';
import { C68676E } from '../../ui-kit/colors';

interface EnterAffiliationsPageProps {
  isRegistration: boolean;
}

export const EnterAffiliationsPage = observer(
  (props: EnterAffiliationsPageProps): ReactElement => {
    console.log('isRegistration' + props.isRegistration);
    debugger;
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
                debugger;
                const isValid = userStore.validate();
                if (isValid) {
                  return userStore.saveWorkplaces(workplaces).then(() => {
                    routerStore.navigatePage(Page.HOME_PAGE);
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
