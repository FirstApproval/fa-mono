import React, { type ReactElement, useState } from 'react';
import styled from '@emotion/styled';
import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Tooltip
} from '@mui/material';
import {
  Close,
  MessageOutlined,
  MonetizationOnOutlined,
  Public
} from '@mui/icons-material';
import Button from '@mui/material/Button';

export const SharingOptionsPage = (): ReactElement => {
  const [checkboxState, setCheckboxState] = useState(false);

  return (
    <>
      <HeaderWrap>
        <HeaderContent>
          Publishing&nbsp;
          <b>
            DNA damage in mice bone marrow cells after acute treatment by
            restraint and olfactory stressors
          </b>
          <MarginLeftAuto>
            <IconButton>
              <Close />
            </IconButton>
          </MarginLeftAuto>
        </HeaderContent>
      </HeaderWrap>
      <BodyWrap>
        <BodyContentWrap>
          <SharingOptionsWrap>
            <SharingOption
              icon={<Public fontSize={'large'} />}
              label={'Open access'}
              description={
                'All users, registered or not, can download your attached files instantly.'
              }
              isSelected
            />
            <Tooltip title="Like science, we value openness and are excited to share what we're working on. New features currently in our 'lab', are being tested and perfected, so stay tuned.">
              <SharingOption
                icon={<MessageOutlined fontSize={'large'} />}
                label={'On request'}
                description={
                  'Other users must send a request with their intention cover letter, which you can approve or decline.'
                }
                isDisabled={true}
              />
            </Tooltip>
            <Tooltip title="Like science, we value openness and are excited to share what we're working on. New features currently in our 'lab', are being tested and perfected, so stay tuned.">
              <SharingOption
                icon={<MonetizationOnOutlined fontSize={'large'} />}
                label={
                  <>
                    {'Monetize'}
                    <br />
                    {'or Co-Authorship'}
                  </>
                }
                description={
                  'Set a price for access or/and accept requests for co-authorship.'
                }
                noMargin={true}
                isDisabled={true}
              />
            </Tooltip>
          </SharingOptionsWrap>
          <PeerReviewSection />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxState}
                  onChange={(e) => {
                    setCheckboxState(e.currentTarget.checked);
                  }}
                />
              }
              label="I confirm that all authors agree to the content, distribution, and comply with the First Approval publishing policy."
            />
          </FormGroup>
          <ButtonWrap variant="contained" disabled={!checkboxState}>
            Publish now for free
          </ButtonWrap>
        </BodyContentWrap>
      </BodyWrap>
    </>
  );
};

interface SharingOptionsProps {
  icon: ReactElement;
  label: string | ReactElement;
  description: string;
  isSelected?: boolean;
  noMargin?: boolean;
  isDisabled?: boolean;
}

// eslint-disable-next-line react/display-name
const SharingOption = React.forwardRef<HTMLDivElement, SharingOptionsProps>(
  (props: SharingOptionsProps, ref): ReactElement => {
    const { label, description, isDisabled, isSelected, noMargin } = props;
    return (
      <SharingOptionWrap
        {...props}
        ref={ref}
        isSelected={isSelected}
        noMargin={noMargin}>
        <SoonWrap>
          <IconWrap>{props.icon}</IconWrap>
          {isDisabled && (
            <MarginLeftAuto>
              <SoonChip />
            </MarginLeftAuto>
          )}
        </SoonWrap>

        <SharingOptionLabel isDisabled={isDisabled}>{label}</SharingOptionLabel>
        <SharingOptionDescription isDisabled={isDisabled}>
          {description}
        </SharingOptionDescription>
      </SharingOptionWrap>
    );
  }
);

const PeerReviewSection = (): ReactElement => {
  return (
    <PeerReviewSectionWrap>
      <>
        Peer review
        <MarginLeftAuto>
          <Switch disabled={true} />
          <SoonChip />
        </MarginLeftAuto>
      </>
    </PeerReviewSectionWrap>
  );
};

const SoonChip = (): ReactElement => {
  return (
    <SoonChipWrap
      label={'soon'}
      sx={{ backgroundColor: 'inherit' }}></SoonChipWrap>
  );
};

const ButtonWrap = styled(Button)`
  margin-top: 24px;
`;

const PeerReviewSectionWrap = styled.div`
  border-radius: 8px;
  background: var(--grey-50, #f8f7fa);
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-top: 48px;
  margin-bottom: 48px;

  color: var(--text-disabled, rgba(4, 0, 54, 0.38));
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
`;

const SoonChipWrap = styled(Chip)`
  border-radius: 100px;
  border: 1px solid var(--primary-main, #3b4eff);
  color: var(--primary-main, #3b4eff);

  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  height: 24px;
`;

const SharingOptionWrap = styled.div<{
  noMargin?: boolean;
  isSelected?: boolean;
}>`
  padding: 24px;
  width: 300px;
  height: 250px;
  border-radius: 8px;
  border: 1px solid var(--divider, #d2d2d6);
  ${(props) =>
    props.isSelected
      ? 'border: 2px solid var(--primary-dark, #3C47E5);' +
        'box-shadow: 0px 0px 4px 0px #3B4EFF;'
      : ''}
  margin-right: ${(props) => (props.noMargin ? '0px' : '24px')};
  display: flex;
  flex-direction: column;
`;

const IconWrap = styled.div`
  color: #04003661;
  margin-bottom: 12px;
`;

const SoonWrap = styled.div`
  display: flex;
`;

const SharingOptionLabel = styled.div<{ isDisabled?: boolean }>`
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  ${(props) =>
    props.isDisabled
      ? 'color: var(--text-disabled, rgba(4, 0, 54, 0.38));'
      : ''}
`;

const SharingOptionDescription = styled.div<{ isDisabled?: boolean }>`
  margin-top: auto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  ${(props) =>
    props.isDisabled
      ? 'color: var(--text-disabled, rgba(4, 0, 54, 0.38));'
      : ''}
`;

const HeaderWrap = styled.div`
  margin-bottom: 16px;
  height: 75px;
  display: flex;
  justify-content: center;
`;

const HeaderContent = styled.div`
  display: flex;
  width: 988px;
  align-items: center;
`;

const MarginLeftAuto = styled.div`
  margin-left: auto;
`;

const BodyWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const BodyContentWrap = styled.div`
  padding: 40px 32px;
`;

const SharingOptionsWrap = styled.div`
  display: flex;
`;
