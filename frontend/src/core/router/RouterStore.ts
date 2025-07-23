import { authStore } from '../auth';
import { action, computed, makeObservable, observable } from 'mobx';
import { createBrowserHistory } from 'history';
import { authService, userService, visitorService } from '../service';
import { v4 as uuidv4 } from 'uuid';
import {
  affiliationsPath,
  authorPath,
  chooseDataCollectionPath,
  contactsPath,
  contestPath,
  emailChangeConfirmationPath,
  emailPath,
  namePath,
  Page,
  passwordChangeConfirmation,
  pathToOauthType,
  publicationPath,
  registrationConfirmationPath,
  shortAuthorPath,
  shortPublicationPath,
  signInPath,
  signUpPath,
  collaborationPath,
  collaborationChatPath,
  downloadedPublicationCollaborationChatPath,
  myPublicationCollaborationsPath,
  myPublicationCollaborationChatPath
} from './constants'
import {
  PUBLICATION_TRIED_TO_DOWNLOAD_SESSION_KEY,
  PUBLISHING_DATA_COLLECTION_TYPE_SESSION_KEY
} from '../../pages/publication/ActionBar';
import { routerStore } from '../router';
import { userStore } from '../user';
import { DataCollectionType } from '../../apis/first-approval-api';

export const INTRO_VIEWED = 'intro_viewed';
export const VISIT_MARK_KEY = 'visit-mark';
export const UTM_SOURCE_KEY = 'utm_source';
export const REFERRER = 'initialReferrer';

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

    window.addEventListener('popstate', (e) => {
      const state = e.state;
      this.setPage(state.page, state.path);
    });

    const restoreFromUrl = (): void => {
      const path = this._path;
      const queryParams = this._queryParams;

      const authType = pathToOauthType[path] ?? undefined;
      const authCode = queryParams.get('code') ?? undefined;

      const utmSource = queryParams.get('utm_source') ?? undefined;
      if (utmSource) {
        localStorage.setItem(UTM_SOURCE_KEY, utmSource);
      }
      const referrer = document.referrer;
      if (referrer && !localStorage.getItem(REFERRER)) {
        localStorage.setItem(REFERRER, referrer);
      }

      if (localStorage.getItem(VISIT_MARK_KEY) !== 'true') {
        void visitorService.saveVisitor(utmSource, referrer).then((response) => {
          if (response.status === 200) {
            localStorage.setItem(VISIT_MARK_KEY, 'true');
          }
        });
      }

      if (path.startsWith(emailChangeConfirmationPath)) {
        this.navigatePage(Page.CHANGE_EMAIL_VERIFICATION, path, true);
        return;
      }

      if (path.startsWith(signInPath)) {
        authStore.token = undefined;
        this.navigatePage(Page.SIGN_IN, path, true);
        return;
      }

      if (path.startsWith(signUpPath)) {
        authStore.token = undefined;
        this.navigatePage(Page.SIGN_UP, path, true);
        return;
      }

      if (path.startsWith(namePath)) {
        this.navigatePage(Page.NAME, path, true);
        return;
      }

      if (window.location.pathname.startsWith(contactsPath)) {
        this.navigatePage(Page.CONTACTS_PAGE, path, true);
        return;
      }

      if (window.location.pathname.startsWith(contestPath)) {
        this.navigatePage(Page.CONTEST_PAGE, path, true);
        return;
      }

      if (path.startsWith(affiliationsPath)) {
        this.navigatePage(Page.AFFILIATIONS, path, true);
        return;
      }

      if (path.startsWith(registrationConfirmationPath)) {
        authStore.token = undefined;
        this.navigatePage(Page.EMAIL_VERIFICATION, path, true);
        return;
      }

      if (path.startsWith(passwordChangeConfirmation)) {
        authStore.token = undefined;
        this.navigatePage(Page.RESET_PASSWORD, path, true);
        return;
      }

      if (path.startsWith(chooseDataCollectionPath)) {
        this.navigatePage(Page.CHOOSE_DATA_COLLECTION_PAGE, path, true);
        return;
      }
      if (path.startsWith(publicationPath)) {
        this.navigatePage(Page.PUBLICATION, path, true);
        return;
      }
      if (path.startsWith(shortPublicationPath)) {
        this.navigatePage(
          Page.PUBLICATION,
          path.replace(shortPublicationPath, `${publicationPath}/`),
          true
        );
        return;
      }

      if (path.startsWith(collaborationChatPath)) {
        this.navigatePage(Page.COLLABORATIONS_CHAT, path, true);
        return;
      }

      if (path.startsWith(downloadedPublicationCollaborationChatPath)) {
        this.navigatePage(Page.DOWNLOADED_PUBLICATION_COLLABORATIONS_CHAT, path, true);
        return;
      }

      if (path.startsWith(myPublicationCollaborationsPath)) {
        this.navigatePage(Page.MY_PUBLICATION_COLLABORATIONS, path, true);
        return;
      }

      if (path.startsWith(myPublicationCollaborationChatPath)) {
        this.navigatePage(Page.MY_PUBLICATION_COLLABORATION_CHAT, path, true);
        return;
      }

      if (path.startsWith(collaborationPath)) {
        this.navigatePage(Page.COLLABORATIONS_PAGE, path, true);
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
            type: authType,
            utmSource: localStorage.getItem(UTM_SOURCE_KEY) ?? undefined,
            initialReferrer: localStorage.getItem(REFERRER) ?? undefined
          })
          .then(async (response) => {
            authStore.token = response.data.token;
            void this.navigateAfterLogin();
          })
          .catch(() => {
            this.setInitialPageError('Authorization failed');
            this.navigatePage(Page.SIGN_IN, '/', true);
          });
      } else {
        this.navigatePage(Page.HOME_PAGE, '/', true);
      }
    };

    restoreFromUrl();
  }

  async navigateAfterLogin(): Promise<void> {
    const requestedPublication = sessionStorage.getItem(
      PUBLICATION_TRIED_TO_DOWNLOAD_SESSION_KEY
    );
    if (requestedPublication) {
      sessionStorage.removeItem(PUBLICATION_TRIED_TO_DOWNLOAD_SESSION_KEY);
      sessionStorage.removeItem(PUBLISHING_DATA_COLLECTION_TYPE_SESSION_KEY);
      routerStore.navigatePage(
        Page.PUBLICATION,
        `${publicationPath}/${requestedPublication}`,
        true
      );
      return;
    }

    const requestedDataCollectionType = sessionStorage.getItem(
      PUBLISHING_DATA_COLLECTION_TYPE_SESSION_KEY
    );
    if (requestedDataCollectionType) {
      const dataCollectionType = DataCollectionType[requestedDataCollectionType as keyof typeof DataCollectionType]
      userStore.goToCreatePublication(dataCollectionType)
      return;
    }

    const userData = (await userService.getMe()).data;
    if (!userData.isNameConfirmed) {
      this.navigatePage(Page.NAME, namePath, true);
    } else if (!userData.email) {
      this.navigatePage(Page.EMAIL, emailPath, true);
    } else if (
      !userData.isWorkplacesConfirmed ||
      !userData.workplaces?.length
    ) {
      this.navigatePage(Page.AFFILIATIONS, affiliationsPath, true);
    } else {
      this.navigatePage(Page.HOME_PAGE, '/', true);
    }
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
    const stateObject = {
      page: value,
      path
    };
    if (replace) {
      window.history.replaceState(stateObject, document.title, path);
    } else {
      window.history.pushState(stateObject, document.title, path);
    }
    this.setPage(value, path);
    this.setPayload(payload);
  };

  back = (): void => window.history.back();

  goHome = (): void => {
    this.navigatePage(Page.HOME_PAGE);
  };

  setInitialPageError = (value: string | undefined): void => {
    this.initialPageError = value;
  };

  get lastPathSegment(): string {
    return this._path.substring(this._path.lastIndexOf('/') + 1);
  }

  get emailConfirmationToken(): string {
    return this._path.substring(
      this._path.lastIndexOf(emailChangeConfirmationPath) +
        emailChangeConfirmationPath.length,
      this._path.lastIndexOf('/')
    );
  }

  get registrationConfirmationPath(): string {
    return this._path.substring(
      this._path.lastIndexOf(registrationConfirmationPath) +
        registrationConfirmationPath.length,
      this._path.lastIndexOf('/')
    );
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
