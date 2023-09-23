import { routerStore } from '../router';
import {
  accountPath,
  authorPath,
  profilePath,
  shortAuthorPath
} from './constants';

export function profileUsername(): string | null {
  return routerStore.path.includes(authorPath)
    ? routerStore.path.substring(
        routerStore.path.lastIndexOf(authorPath) + authorPath.length
      )
    : null;
}

export function accountTab(): string | null {
  return routerStore.path.includes(accountPath)
    ? routerStore.path.substring(
        routerStore.path.lastIndexOf(accountPath) + accountPath.length
      )
    : null;
}

export function profileTab(): string | null {
  return routerStore.path.includes(profilePath)
    ? routerStore.path.substring(
        routerStore.path.lastIndexOf(profilePath) + profilePath.length
      )
    : null;
}

export const getShortAuthorLink = (username = ''): string => {
  return window.location.host + shortAuthorPath + username;
};

export const getAuthorLink = (username = ''): string => {
  return authorPath + username;
};
