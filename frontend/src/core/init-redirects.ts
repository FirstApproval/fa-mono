import { contestPath } from './router/constants';
import { INTRO_VIEWED } from "./router/RouterStore"

export async function initRedirects(): Promise<void> {
  const introViewed = localStorage.getItem(INTRO_VIEWED) === 'true';
  const isContestPage = window.location.pathname.startsWith(contestPath)
  if (!introViewed && !isContestPage) {
    localStorage.setItem(INTRO_VIEWED, 'true');
    window.location.replace('https://intro.dev.firstapproval.io/');
  }
}
