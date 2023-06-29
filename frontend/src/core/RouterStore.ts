import { authStore } from './auth';
import { OauthType } from '../apis/first-approval-api';
import { action, autorun, makeObservable, observable } from 'mobx';
import { createBrowserHistory } from 'history';
import { authService } from './service';

export enum Page {
  LOADING,

  SIGN_IN,
  SIGN_UP,

  HOME_PAGE,

  SIGN_UP_NAME,
  SIGN_UP_PASSWORD,
  EMAIL_VERIFICATION,

  RESTORE_PASSWORD_EMAIL
}

const pathToOauthType: Record<string, OauthType> = {
  '/google-callback': OauthType.GOOGLE,
  '/linkedin-callback': OauthType.LINKEDIN
};

const history = createBrowserHistory();

export class RouterStore {
  page: Page = Page.LOADING;
  path: string = history.location.pathname;
  queryParams: URLSearchParams = new URLSearchParams(history.location.search);
  initialPageError: string | undefined;

  constructor() {
    makeObservable(this, {
      page: observable,
      path: observable,
      queryParams: observable,
      initialPageError: observable,
      setInitialPageError: action,
      setPage: action,
      setPath: action,
      setQueryParams: action
    });

    const listener = (location: any): void => {
      this.setPath(location.pathname);
      this.setQueryParams(location.search);
    };

    history.listen(listener);

    autorun(() => {
      const path = this.path;
      const queryParams = this.queryParams;
      const token = authStore.token;

      const authType = pathToOauthType[path] ?? undefined;
      const authCode = queryParams.get('code') ?? undefined;

      if (token !== undefined) {
        this.setPage(Page.HOME_PAGE);
      } else if (authType !== undefined && authCode !== undefined) {
        authService
          .authorizeOauth({
            code: authCode,
            type: authType
          })
          .then((response) => {
            const token = response.data.token;
            authStore.token = token;
            window.history.replaceState({}, document.title, '/');
            this.setPage(Page.HOME_PAGE);
          })
          .catch(() => {
            this.setInitialPageError('Authorization failed');
            this.setPage(Page.SIGN_IN);
          });
      } else {
        this.setPage(Page.SIGN_IN);
      }
    });
  }

  setPage = (value: Page): void => {
    this.page = value;
  };

  setPath = (value: string): void => {
    this.path = value;
  };

  setQueryParams = (value: URLSearchParams): void => {
    this.queryParams = value;
  };

  setInitialPageError = (value: string | undefined): void => {
    this.initialPageError = value;
  };
}