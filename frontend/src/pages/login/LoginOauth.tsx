import { type FunctionComponent, useEffect, useState } from 'react';
import { loadAuthUrls } from '../../core/AuthStore';
import { Button, CircularProgress, IconButton } from '@mui/material';
import google from './asset/Google logo.svg';
import orcid from './asset/ORCID logo.svg';
import facebook from './asset/Facebook logo.svg';
import linked from './asset/LinkedIn logo.svg';
import styled from '@emotion/styled';

export const LoginOauth: FunctionComponent = () => {
  const [authUrls, setAuthUrls] = useState<{ google?: string }>();

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
            size={'large'}
            startIcon={<img src={google} />}
            href={authUrls.google}>
            Sign in with Google
          </FullWidthButton>
          <IconButtonWrap>
            <img src={orcid} />
          </IconButtonWrap>
          <IconButtonWrap>
            <img src={facebook} />
          </IconButtonWrap>
          <IconButtonWrap>
            <img src={linked} />
          </IconButtonWrap>
        </div>
      )}
    </>
  );
};

const FullWidthButton = styled(Button)`
  width: 100%;
`;

const IconButtonWrap = styled(IconButton)`
  margin-left: 24px;
`;
