import { type FunctionComponent, useEffect, useState } from 'react';
import { loadAuthUrls } from '../../core/AuthStore';
import { CircularProgress, IconButton, Link } from '@mui/material';
import google from './asset/Google logo.svg';
import orcid from './asset/ORCID logo.svg';
import facebook from './asset/Facebook logo.svg';
import linked from './asset/LinkedIn logo.svg';
import styled from '@emotion/styled';
import { FullWidthButton } from '../common.styled';
import { type AuthorizationLinksResponse } from '../../apis/first-approval-api';

export const LoginOauth: FunctionComponent = () => {
  const [authUrls, setAuthUrls] = useState<AuthorizationLinksResponse>();

  useEffect(() => {
    void loadAuthUrls().then((authUrls) => {
      setAuthUrls(authUrls);
    });
  }, []);

  return (
    <>
      {authUrls === undefined && <CircularProgress />}
      {authUrls !== undefined && (
        <div style={{ display: 'flex' }}>
          <FullWidthButton
            variant="outlined"
            size={'medium'}
            startIcon={<img src={google} />}
            href={authUrls.google}>
            Sign in with Google
          </FullWidthButton>
          <Divider />
          <IconButtonWrap size={'medium'}>
            <img src={orcid} />
          </IconButtonWrap>
          <IconButtonWrap size={'medium'}>
            <img src={facebook} />
          </IconButtonWrap>
          <Link href={authUrls.linkedin}>
            <IconButtonWrap size={'medium'}>
              <img src={linked} />
            </IconButtonWrap>
          </Link>
        </div>
      )}
    </>
  );
};

const IconButtonWrap = styled(IconButton)`
  margin-left: 16px;
  padding: 3px;
`;

const Divider = styled(IconButton)`
  padding-left: 12px;
`;
