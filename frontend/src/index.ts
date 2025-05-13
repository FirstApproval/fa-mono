import * as React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { initAuth } from './core/auth';
import { initRouter } from './core/router';
import axios from 'axios';

void (async (): Promise<void> => {
  await initAuth();
  await initRouter();

  const module = await import('./App');

  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(module.default));
  }
})();

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.replace('/sign_in');
    }
    return await Promise.reject(error);
  }
);
