import { type RouterStore } from './router/RouterStore';

export let routerStore: RouterStore;

export async function initRouter(): Promise<void> {
  await import('./router/RouterStore').then((module) => {
    routerStore = new module.RouterStore();
  });
}
