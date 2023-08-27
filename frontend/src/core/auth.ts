import { type AuthStore } from './AuthStore';

export let authStore: AuthStore;

export async function initAuth(): Promise<void> {
  await import('./AuthStore').then((module) => {
    authStore = new module.AuthStore();
  });
}
