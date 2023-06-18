import { useEffect, useState } from 'react';
import { usePath } from './history';
import { authStore } from './auth';
import { OauthType } from '../apis/first-approval-api';

export enum Page {
  LOADING,

  SIGN_IN,
  SIGN_UP,

  HOME_PAGE,

  SIGN_UP_NAME,
  SIGN_UP_PASSWORD
}

export const useRouter = (
  setAuthError: (value: boolean) => void
): { page: Page; setPage: (value: Page) => void } => {
  const [page, setPage] = useState(Page.LOADING);
  const { path, queryParams } = usePath();

  useEffect(() => {
    let type;
    let code;
    if (path === '/google-callback') {
      type = OauthType.GOOGLE;
      code = queryParams.get('code') ?? undefined;
    } else {
      const token = authStore.token;
      if (token !== undefined) {
        setPage(Page.HOME_PAGE);
      } else {
        setPage(Page.SIGN_IN);
      }
    }

    if (type !== undefined && code !== undefined) {
      authStore
        .exchangeToken(code, type)
        .then(() => {
          window.history.replaceState({}, document.title, '/');
          setPage(Page.HOME_PAGE);
        })
        .catch(() => {
          setAuthError(true);
          setPage(Page.SIGN_IN);
        });
    }
  }, [path, queryParams]);

  return { page, setPage };
};
