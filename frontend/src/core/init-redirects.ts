export async function initRedirects(): Promise<void> {
  const introViewed = localStorage.getItem('intro_viewed') === 'true';
  if (!introViewed) {
    localStorage.setItem('intro_viewed', 'true');
    window.location.replace('https://intro.dev.firstapproval.io/');
  }
}
