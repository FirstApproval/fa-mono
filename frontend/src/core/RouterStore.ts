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
  SHARING_OPTIONS,

  PROFILE,
  ACCOUNT,

  SIGN_UP_NAME,
  SELF_INFO,
  SIGN_UP_PASSWORD,
  EMAIL_VERIFICATION,

  RESET_PASSWORD,
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

  payload: any = {};
  initialPageError: string | undefined;

  constructor() {
    makeObservable<RouterStore, '_page' | '_path' | '_queryParams' | 'setPage'>(
      this,
      {
        _page: observable,
        _path: observable,
        _queryParams: observable,
        page: computed,
        path: computed,
        lastPathSegment: computed,
        initialPageError: observable,
        setInitialPageError: action,
        setPage: action,
        setPayload: action
      }
    );

    reaction(
      () => authStore.token,
      (token) => {
        if (!token) {
          this.navigatePage(Page.SIGN_IN);
        }
      }
    );

    window.addEventListener('popstate', (e) => {
      const state = e.state;
      this.setPage(state.page, state.path);
    });

    const restoreFromUrl = (): void => {
      const path = this._path;
      const queryParams = this._queryParams;

      const authType = pathToOauthType[path] ?? undefined;
      const authCode = queryParams.get('code') ?? undefined;

      if (path.startsWith('/registration-confirmation')) {
        authStore.token = undefined;
        this.navigatePage(Page.EMAIL_VERIFICATION, path, true);
        return;
      }

      if (path.startsWith('/password-change-confirmation')) {
        authStore.token = undefined;
        this.navigatePage(Page.RESET_PASSWORD, path, true);
        return;
      }

      if (path.startsWith('/publication')) {
        this.navigatePage(Page.PUBLICATION, path, true);
        return;
      }
      if (path.startsWith('/account')) {
        this.navigatePage(Page.ACCOUNT, path, true);
        return;
      }
      if (path.startsWith('/profile')) {
        this.navigatePage(Page.PROFILE, path, true);
        return;
      }

      if (authType !== undefined && authCode !== undefined) {
        authService
          .authorizeOauth({
            code: authCode,
            type: authType
          })
          .then((response) => {
            authStore.token = response.data.token;
            this.navigatePage(Page.HOME_PAGE, '/', true);
          })
          .catch(() => {
            this.setInitialPageError('Authorization failed');
            this.navigatePage(Page.SIGN_IN, '/', true);
          });
      } else if (authStore.token) {
        this.navigatePage(Page.HOME_PAGE, '/', true);
      } else {
        this.navigatePage(Page.SIGN_IN, '/', true);
      }
    };

    restoreFromUrl();
  }

  get path(): string {
    return this._path;
  }

  get page(): Page {
    return this._page;
  }

  private readonly setPage = (value: Page, path: string = '/'): void => {
    this._page = value;
    this._path = path;
    this._queryParams = new URLSearchParams(path);
  };

  setPayload = (value: any): void => {
    this.payload = value;
  };

  navigatePage = (
    value: Page,
    path: string = '/',
    replace: boolean = false,
    payload: any = {}
  ): void => {
    const stateObject = { page: value, path };
    if (replace) {
      window.history.replaceState(stateObject, document.title, path);
    } else {
      window.history.pushState(stateObject, document.title, path);
    }
    this.setPage(value, path);
    this.setPayload(payload);
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
