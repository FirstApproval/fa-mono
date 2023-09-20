import { MutableRefObject, useLayoutEffect, useState } from 'react';

export const useIsHorizontalOverflow = (
  ref: MutableRefObject<any>,
  callback: (value: boolean) => void
): boolean | undefined => {
  const [isOverflow, setIsOverflow] = useState<boolean>();

  useLayoutEffect(() => {
    const { current } = ref;

    const trigger = (): void => {
      const hasOverflow = current.scrollWidth > current.clientWidth;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};
