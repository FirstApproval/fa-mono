import * as React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';

void (async (): Promise<void> => {
  const module = await import('./App');

  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(module.default));
  }
})();
