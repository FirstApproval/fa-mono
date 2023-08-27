import { type RouterStore } from './RouterStore';

export let routerStore: RouterStore;

export async function initRouter(): Promise<void> {
  await import('./RouterStore').then((module) => {
    routerStore = new module.RouterStore();
  });
}
