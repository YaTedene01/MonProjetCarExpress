/**
 * Utilitaires pour une meilleure responsivité
 */

// Breakpoints
export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

// Media query strings
export const MEDIA = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  small: '(max-width: 480px)',
  medium: '(min-width: 481px) and (max-width: 1023px)',
  large: '(min-width: 1024px)',
};

// Fonction pour obtenir un padding responsive
export const getResponsivePadding = (isMobile, isTablet) => {
  if (isMobile) return { x: 12, y: 12 };
  if (isTablet) return { x: 18, y: 16 };
  return { x: 24, y: 20 };
};

// Fonction pour obtenir une taille de font responsive
export const getResponsiveFontSize = (isMobile, baseSize) => {
  if (isMobile) return Math.max(12, baseSize - 4);
  return baseSize;
};

// Fonction pour obtenir un gap responsive
export const getResponsiveGap = (isMobile) => {
  return isMobile ? 8 : 12;
};

// Fonction pour layout responsive
export const getResponsiveLayout = (isMobile, isTablet) => {
  if (isMobile) {
    return {
      containerPadding: '12px',
      containerMaxWidth: '100%',
      gridCols: 1,
      gap: 8,
    };
  }
  if (isTablet) {
    return {
      containerPadding: '18px',
      containerMaxWidth: '100%',
      gridCols: 2,
      gap: 12,
    };
  }
  return {
    containerPadding: '24px',
    containerMaxWidth: '1360px',
    gridCols: 3,
    gap: 16,
  };
};
