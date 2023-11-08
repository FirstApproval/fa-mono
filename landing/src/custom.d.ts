declare module '*.svg' {
  import { ReactElement } from 'react';
  const content: any;

  export const ReactComponent: () => ReactElement;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.mov' {
  const src: string;
  export default src;
}
