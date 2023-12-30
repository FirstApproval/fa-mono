import styled from '@emotion/styled';
import { ReactElement } from 'react';
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as XLogo } from './assets/x_logo.svg';
import { ReactComponent as FaBeta } from './assets/fa_beta.svg';

export const Footer = (): ReactElement => {
  return (
    <FooterWrap>
      <div>
        <LogoWrap href={'https://firstapproval.io/'} target={'_blank'}>
          <AdaptiveLogoWrap />
        </LogoWrap>
        <LogoTextWrap>
          Experience the reimagined scientific data publishing
        </LogoTextWrap>
        <XTextWrap href={'https://twitter.com/FirstApproval'} target={'_blank'}>
          <AdaptiveXLogoWrap />
          <XFollowUsText>Follow us&nbsp;</XFollowUsText>
          <XOnXText>on X (ex. Twitter) for updates</XOnXText>
        </XTextWrap>
        <HelpLinksWrap>
          <HelpLink href={'https://firstapproval.io/'} target={'_blank'}>
            Join Beta
          </HelpLink>
          <HelpLink
            href={'https://firstapproval.io/docs/privacy_policy.pdf'}
            target={'_blank'}>
            Privacy
          </HelpLink>
          <HelpLink
            href={'https://firstapproval.io/docs/terms_and_conditions.pdf'}
            target={'_blank'}>
            Terms
          </HelpLink>
          <HelpLink
            href={'https://firstapproval.io/contacts'}
            target={'_blank'}>
            Contact us
          </HelpLink>
        </HelpLinksWrap>
      </div>

      <div>
        <LogoWrap href={'https://firstapproval.io/'} target={'_blank'}>
          <GetEarlyAccessWrap>
            <FaBeta />
            <GetEarlyAccessText>Get early access</GetEarlyAccessText>
          </GetEarlyAccessWrap>
        </LogoWrap>
        <FineTuningText>
          We are still fine-tuning the platform and would love your feedback.
        </FineTuningText>
        <FirstApprovalFooterText>
          © 2023 First Approval (FA)
        </FirstApprovalFooterText>
      </div>
    </FooterWrap>
  );
};

const LogoWrap = styled.a`
  text-decoration: none;
`;

const AdaptiveLogoWrap = styled(Logo)`
  @media (max-width: 500px) {
    width: 160px;
  }
`;

const FooterWrap = styled.div`
  background: #f3f2f5;

  margin: 40px;
  padding: 80px;

  display: flex;
  justify-content: space-between;

  @media (max-width: 500px) {
    margin: 16px;
    padding: 32px 16px;

    flex-direction: column;
    justify-content: start;
  }
`;

const LogoTextWrap = styled.div`
  margin-top: 16px;
  width: 264px;
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  /* typography/body */
  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;

  @media (max-width: 500px) {
    margin-top: 8px;
    font-family: Roboto, serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 143%; /* 20.02px */
    letter-spacing: 0.17px;
  }
`;

const AdaptiveXLogoWrap = styled(XLogo)`
  @media (max-width: 500px) {
    width: 32px;
  }
`;

const XTextWrap = styled.a`
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 8px;
  text-decoration: none;

  @media (max-width: 500px) {
    margin-top: 32px;
    width: 274px;
  }

    &:hover {
        transition: 300ms ease-in-out;
        border-radius: 8px;
        background: #FFF;
        box-shadow: 0 6px 12px 0 rgba(4, 0, 54, 0.18);
    }
`;

const XFollowUsText = styled.span`
  margin-left: 12px;
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 24.012px */

  @media (max-width: 500px) {
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 133.4%; /* 17.342px */
  }
`;

const XOnXText = styled.span`
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%;

  @media (max-width: 500px) {
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, serif;
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 133.4%; /* 17.342px */
  }
`;

const HelpLinksWrap = styled.div`
  width: 300px;
  margin-top: 68px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 500px) {
    width: 280px;
    margin-top: 32px;
  }
`;

const HelpLink = styled.a`
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;
  text-decoration: none;

  /* typography/body1 */
  font-family: Roboto, serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;

  @media (max-width: 500px) {
    font-family: Roboto, serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 143%; /* 20.02px */
    letter-spacing: 0.17px;
  }

    &:hover {
        text-decoration: underline;
    }
`;

const GetEarlyAccessWrap = styled.div`
  border-radius: 16px;
  background: #ffffff;
  padding: 12px;
  display: flex;
  align-items: center;

  @media (max-width: 500px) {
    margin-top: 32px;
  }
    
    &:hover {
        transition: 300ms ease-in-out;
        border-radius: 16px;
        background: #FFF;
        box-shadow: 0 6px 12px 0 rgba(4, 0, 54, 0.18);
    }
`;

const GetEarlyAccessText = styled.span`
  margin-left: 20px;
  width: 120px;
  color: #040036;
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/h5 */
  font-family: Roboto, serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 133.4%; /* 32.016px */
`;

const FineTuningText = styled.div`
  margin-top: 16px;
  width: 256px;
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body1 */
  font-family: Roboto, serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;

  @media (max-width: 500px) {
    margin-top: 32px;
    font-family: Roboto, serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 143%; /* 20.02px */
    letter-spacing: 0.17px;
  }
`;

const FirstApprovalFooterText = styled.div`
  text-align: end;
  margin-top: 80px;
  color: rgba(4, 0, 54, 0.38);
  font-feature-settings: 'clig' off, 'liga' off;

  /* typography/body1 */
  font-family: Roboto, serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: 0.15px;

  @media (max-width: 500px) {
    margin-top: 32px;
    text-align: start;

    font-feature-settings: 'clig' off, 'liga' off;

    /* typography/body2 */
    font-family: Roboto, serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 143%; /* 20.02px */
    letter-spacing: 0.17px;
  }
`;
