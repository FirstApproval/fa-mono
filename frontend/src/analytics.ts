import ReactGA from 'react-ga4';
import { Page } from './core/router/constants';

const GA_ID = "G-676C10R8V2";

export function initAnalytics() {
  if (process.env.NODE_ENV === "production") {
    ReactGA.initialize(GA_ID);
  }
}

function pageToName(page: Page): string {
  return Page[page] ?? "UNKNOWN";
}

export function trackPage(page: Page) {
  const name = pageToName(page);
  if (process.env.NODE_ENV === "production") {
    ReactGA.send({ hitType: "pageview", page: name });
  } else {
    console.debug(`[Analytics] Page view: ${name}`);
  }
}
