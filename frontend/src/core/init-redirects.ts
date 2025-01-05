import { contestPath } from './router/constants';
export async function initRedirects(): Promise<void> {
  const introViewed = localStorage.getItem('intro_viewed') === 'true';
  const isContestPage = window.location.pathname.startsWith(contestPath)
  if (!introViewed && !isContestPage) {
    localStorage.setItem('intro_viewed', 'true');
    window.location.replace('https://intro.dev.firstapproval.io/');
  }
}
