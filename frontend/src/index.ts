import * as React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { initAuth } from './core/auth';
import { initRouter } from './core/router';

void (async (): Promise<void> => {
  await initAuth();
  await initRouter();

  const module = await import('./App');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const container = document.getElementById('root')!;
  const root = createRoot(container);
  root.render(React.createElement(module.default));

  console.log('First Approval App started');
})();
