import { authStore } from './auth';
import { OauthType } from '../apis/first-approval-api';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { createBrowserHistory } from 'history';
import { authService } from './service';

export enum Page {
  LOADING,

  SIGN_IN,
  SIGN_UP,

  HOME_PAGE,

  PUBLICATION,

  SIGN_UP_NAME,
  SIGN_UP_PASSWORD,
  EMAIL_VERIFICATION,

  RESTORE_PASSWORD_EMAIL
}

const pathToOauthType: Record<string, OauthType> = {
  '/facebook-callback': OauthType.FACEBOOK,
  '/google-callback': OauthType.GOOGLE,
  '/linkedin-callback': OauthType.LINKEDIN,
  '/orcid-callback': OauthType.ORCID
};

const history = createBrowserHistory();

export class RouterStore {
  private _page: Page = Page.LOADING;
  private _path: string = history.location.pathname;
  private _queryParams: URLSearchParams = new URLSearchParams(
    history.location.search
  );

  initialPageError: string | undefined;

  constructor() {
    makeObservable<RouterStore, '_page' | '_path' | '_queryParams'>(this, {
      _page: observable,
      _path: observable,
      _queryParams: observable,
      page: computed,
      lastPathSegment: computed,
      initialPageError: observable,
      setInitialPageError: action,
      navigatePage: action
    });

    reaction(() => authStore.token, this.goHome);

    window.addEventListener('popstate', (e) => {
      const state = e.state;
      this.setPage(state.page, state.path);
    });

    const restoreFromUrl = (): void => {
      const path = this._path;
      const queryParams = this._queryParams;

      const authType = pathToOauthType[path] ?? undefined;
      const authCode = queryParams.get('code') ?? undefined;

      if (authType !== undefined && authCode !== undefined) {
        authService
          .authorizeOauth({
            code: authCode,
            type: authType
          })
          .then((response) => {
            const token = response.data.token;
            authStore.token = token;
            window.history.replaceState({}, document.title, '/');
            this.navigatePage(Page.HOME_PAGE);
          })
          .catch(() => {
            this.setInitialPageError('Authorization failed');
            this.navigatePage(Page.SIGN_IN);
          });
        return;
      }

      if (path.startsWith('/publication')) {
        this.navigatePage(Page.PUBLICATION, path);
        return;
      }

      this.goHome();
    };

    restoreFromUrl();
  }

  get page(): Page {
    return this._page;
  }

  setPage = (value: Page, path: string = '/'): void => {
    this._page = value;
    this._path = path;
    this._queryParams = new URLSearchParams(path);
  };

  navigatePage = (value: Page, path: string = '/'): void => {
    const stateObject = { page: value, path };
    window.history.pushState(stateObject, document.title, path);
    this.setPage(value, path);
  };

  goHome = (): void => {
    const token = authStore.token;
    if (token !== undefined) {
      this.navigatePage(Page.HOME_PAGE);
    } else {
      this.navigatePage(Page.SIGN_IN);
    }
  };

  setInitialPageError = (value: string | undefined): void => {
    this.initialPageError = value;
  };

  get lastPathSegment(): string {
    return this._path.substring(this._path.lastIndexOf('/') + 1);
  }
}
