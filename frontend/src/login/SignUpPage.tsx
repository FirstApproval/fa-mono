import { type FunctionComponent } from 'react'
import { Button, Divider, IconButton, InputAdornment, Link, TextField } from '@mui/material'
import styled from '@emotion/styled'
import google from './asset/Google logo.svg'
import linked from './asset/LinkedIn logo.svg'
import facebook from './asset/Facebook logo.svg'
import orcid from './asset/ORCID logo.svg'
import { ArrowForward, LockOutlined } from '@mui/icons-material'

interface SignUpPageProps {
  onContinueClick: () => void
}

export const SignUpPage: FunctionComponent<SignUpPageProps> = (props: SignUpPageProps) => {
  return <Parent>
    <FlexHeader>
      <Logo>First Approval</Logo>
      <FlexHeaderRight>
      <Button variant="outlined" size={'large'}>Sign up</Button></FlexHeaderRight>
    </FlexHeader>
    <FlexBodyCenter>
      <FlexBody>
        <SignInHeader>Sign up</SignInHeader>
        <EmailLabel>Join the future of scientific discovery today</EmailLabel>
        <div>
          <FullWidthTextField label="Email" variant="outlined" InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined />
              </InputAdornment>
            )
          }}/></div>
        <FullWidthButton variant="contained" size={'large'} endIcon={<ArrowForward/>}>Continue with email</FullWidthButton>
        <DividerWrap>or</DividerWrap>
        <div style={{ display: 'flex' }}>
          <FullWidthButton variant="outlined" size={'large'} startIcon={<img src={google}/>}>Sign in with Google</FullWidthButton>
          <IconButtonWrap><img src={orcid}/></IconButtonWrap>
          <IconButtonWrap><img src={facebook}/></IconButtonWrap>
          <IconButtonWrap><img src={linked}/></IconButtonWrap>
        </div>
        <DividerWrap />
        <CreateAccount>Already have an account? <Link href="#">Sign in</Link></CreateAccount>
        <FooterWrap>
          By clicking “Continue with Email/Google/ORCID/Facebook/LinkedIn” above, you acknowledge that you have read and understood, and agree to Terms & Conditions and Privacy Policy.
        </FooterWrap>
      </FlexBody>
    </FlexBodyCenter>
  </Parent>
}

const Parent = styled('div')`
  width: 100%;
`

const FlexHeader = styled('div')`
  display: flex;
  padding: 40px;
  align-items: center;
`

const FlexHeaderRight = styled('div')`
  margin-left: auto;
`

const FlexBodyCenter = styled('div')`
  display: flex;
  justify-content: center;
`

const FlexBody = styled('div')`
  width: 580px;
  padding-left: 40px;
  padding-right: 40px;
`

const SignInHeader = styled('div')`
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 16px;
`

const FullWidthButton = styled(Button)`
  width: 100%;
`

const FullWidthTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 20px;
`

const EmailLabel = styled('div')`
  font-weight: 400;
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
`

const Logo = styled('div')`
  font-weight: 860;
  font-size: 20px;
`

const DividerWrap = styled(Divider)`
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;
`

const CreateAccount = styled('div')`
  font-weight: 400;
  font-size: 20px;
`

const FooterWrap = styled('div')`
  text-align: center;
  margin-top: 36px;
  font-weight: 400;
  font-size: 12px;
  color: #68676E;
`

const IconButtonWrap = styled(IconButton)`
  margin-left: 24px;
`
