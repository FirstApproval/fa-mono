import { computed, makeObservable, observable } from 'mobx';
import { routerStore } from './router';
import { Page } from './router/constants';

const ACCESS_TOKEN_KEY = 'access-token';

export class AuthStore {
  private _token: string | undefined = undefined;

  constructor() {
    makeObservable<AuthStore, '_token'>(this, {
      _token: observable,
      token: computed
    });

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token !== null) {
      this.token = token;
    }
  }

  get token(): string | undefined {
    return this._token;
  }

  set token(value: string | undefined | null) {
    this._token = value ?? undefined;
    if (this._token !== undefined) {
      localStorage.setItem(ACCESS_TOKEN_KEY, this._token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      routerStore.navigatePage(Page.HOME_PAGE, '/', true);
    }
  }
}
