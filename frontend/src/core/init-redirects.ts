import { pathToOauthType, signInPath, signUpPath } from './router/constants';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export async function initRedirects(): Promise<void> {
  const _path: string = history.location.pathname;
  const isAuthorizedUser = !!localStorage.getItem('access-token');
  const isSignUpPath = window.location.href.endsWith(signUpPath);
  const isSignInPath = window.location.href.endsWith(signInPath);
  const isOauthCallback = !!pathToOauthType[_path];

  if (!isAuthorizedUser && !isSignUpPath && !isSignInPath && !isOauthCallback) {
    window.location.replace('https://intro.dev.firstapproval.io/');
  }
}
