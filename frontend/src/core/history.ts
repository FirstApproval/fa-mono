import { createBrowserHistory, type Listener } from 'history';
import { useEffect, useState } from 'react';

const history = createBrowserHistory();

export const usePath = (): { path: string; queryParams: URLSearchParams } => {
  const [path, pathSet] = useState(history.location.pathname);
  const [queryParams, queryParamsSet] = useState(
    new URLSearchParams(history.location.search)
  );

  const listener = (location: any, action: any): void => {
    pathSet(location.pathname);
    queryParamsSet(location.search);
  };

  useEffect(() => {
    const unlisten = history.listen(listener as Listener);
    return unlisten;
  }, []);

  return { path, queryParams };
};
