import { useRef, useEffect } from 'react';

export const useIsMounted = () => {
  const isMountRef = useRef(false);

  useEffect(() => {
    isMountRef.current = true;
  }, []);

  return isMountRef.current;
};