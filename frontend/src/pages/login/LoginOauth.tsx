import { type FunctionComponent, useEffect, useState } from 'react';
import { CircularProgress, Grid, IconButton, Link } from '@mui/material';
import google from './asset/Google logo.svg';
import orcid from './asset/ORCID logo.svg';
import facebook from './asset/Facebook logo.svg';
import linked from './asset/LinkedIn logo.svg';
import styled from '@emotion/styled';
import { FullWidthButton } from '../common.styled';
import { type AuthorizationLinksResponse } from '../../apis/first-approval-api';
import { authService } from '../../core/service';

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
        <Grid container alignItems={'center'} spacing={2}>
          <Grid item xs={12} md={6}>
            <FullWidthButton
              variant="outlined"
              size={'medium'}
              startIcon={<img src={google} />}
              href={authUrls.google}>
              Log in with Google
            </FullWidthButton>
          </Grid>
          <Grid display={'flex'} item xs={4} md={2} justifyContent={'center'}>
            <Link href={authUrls.orcid}>
              <IconButtonWrap size={'medium'}>
                <img src={orcid} />
              </IconButtonWrap>
            </Link>
          </Grid>
          <Grid display={'flex'} item xs={4} md={2} justifyContent={'center'}>
            <Link href={authUrls.facebook}>
              <IconButtonWrap size={'medium'}>
                <img src={facebook} />
              </IconButtonWrap>
            </Link>
          </Grid>
          <Grid display={'flex'} item xs={4} md={2} justifyContent={'center'}>
            <Link href={authUrls.linkedin}>
              <IconButtonWrap size={'medium'}>
                <img src={linked} />
              </IconButtonWrap>
            </Link>
          </Grid>
        </Grid>
      )}
    </>
  );
};

const IconButtonWrap = styled(IconButton)``;

export const loadAuthUrls = async (): Promise<AuthorizationLinksResponse> => {
  const urls = await authService.authorizationLinks();
  return urls.data;
};
