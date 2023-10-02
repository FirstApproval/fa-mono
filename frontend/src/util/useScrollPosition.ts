import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

const useScrollPosition = (): number => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = debounce((): void => {
      setScrollPosition(window.scrollY);
    }, 100);
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
