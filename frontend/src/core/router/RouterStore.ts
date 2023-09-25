import { authStore } from '../auth';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { createBrowserHistory } from 'history';
import { authService } from '../service';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCOUNT_AFFILIATIONS_PATH,
  authorPath,
  Page,
  pathToOauthType,
  publicationPath,
  shortAuthorPath,
  shortPublicationPath
} from './constants';
import { userStore } from '../user';

const history = createBrowserHistory();

export class RouterStore {
  key = uuidv4();
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
        key: observable,
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
      () => userStore.user,
      (user) => {
        if (user?.workplaces?.length === 0) {
          this.navigatePage(Page.ACCOUNT, ACCOUNT_AFFILIATIONS_PATH, true);
        } else {
          this.navigatePage(Page.HOME_PAGE, '/', true);
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

      if (path.startsWith('/sign_in')) {
        authStore.token = undefined;
        this.navigatePage(Page.SIGN_IN, path, true);
        return;
      }

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

      if (path.startsWith(publicationPath)) {
        this.navigatePage(Page.PUBLICATION, path, true);
        return;
      }
      if (path.startsWith(shortPublicationPath)) {
        this.navigatePage(
          Page.PUBLICATION,
          path.replace(shortPublicationPath, publicationPath),
          true
        );
        return;
      }
      if (path.startsWith(authorPath)) {
        this.navigatePage(Page.PROFILE, path, true);
        return;
      }
      if (path.startsWith(shortAuthorPath)) {
        this.navigatePage(
          Page.PROFILE,
          path.replace(shortAuthorPath, authorPath),
          true
        );
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
          })
          .catch(() => {
            this.setInitialPageError('Authorization failed');
            this.navigatePage(Page.SIGN_IN, '/', true);
          });
      } else {
        this.navigatePage(Page.HOME_PAGE, '/', true);
      }
    };

    debugger;
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
    this.key = uuidv4();
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
    this.navigatePage(Page.HOME_PAGE);
  };

  setInitialPageError = (value: string | undefined): void => {
    this.initialPageError = value;
  };

  get lastPathSegment(): string {
    return this._path.substring(this._path.lastIndexOf('/') + 1);
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
