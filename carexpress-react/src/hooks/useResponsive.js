import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../utils/responsive';

/**
 * Hook pour détecter la taille de l'écran
 */
export const useResponsive = () => {
  const [width, setWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024;
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    isMobile: width <= BREAKPOINTS.md,
    isTablet: width > BREAKPOINTS.md && width <= BREAKPOINTS.lg,
    isDesktop: width > BREAKPOINTS.lg,
    isSmall: width <= BREAKPOINTS.sm,
  };
};
