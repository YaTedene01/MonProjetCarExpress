/**
 * Configuration de thème et design system pour CarExpress
 * Design moderne et professionnel
 */

export const THEME = {
  // Couleurs
  colors: {
    // Primaire (Rouge)
    primary: '#D40511',
    primaryLight: '#FFF1F1',
    primaryMid: '#F7C4C8',
    primaryHover: 'rgba(212, 5, 17, 0.9)',
    primaryShadow: 'rgba(212, 5, 17, 0.3)',
    primaryGradient: 'linear-gradient(135deg, #D40511, #ff6b6b)',

    // Accent (Jaune)
    accent: '#FFCC00',
    accentLight: '#FFF8D6',
    accentMid: '#FFE066',
    accentText: '#7a5c00',
    accentGradient: 'linear-gradient(135deg, #FFCC00, #ffd700)',

    // Neutres
    black: '#111111',
    white: '#FFFFFF',

    // Backgrounds
    bgPrimary: '#f7f3ee',
    bgSecondary: '#fffdfb',
    bgTertiary: '#efe6dd',

    // Panel
    panelWeak: 'rgba(255, 255, 255, 0.72)',
    panelStrong: 'rgba(255, 255, 255, 0.92)',

    // Texte
    text: '#181512',
    textSecondary: '#5f5750',
    textTertiary: '#8f877f',

    // Borders
    border: 'rgba(24, 21, 18, 0.1)',
    borderStrong: 'rgba(24, 21, 18, 0.18)',

    // Success
    success: '#1a7a2e',
    successLight: '#e6f4ea',

    // Additional colors for modern design
    blue: '#3B82F6',
    blueLight: 'rgba(59, 130, 246, 0.1)',
    purple: '#8B5CF6',
    purpleLight: 'rgba(139, 92, 246, 0.1)',
    green: '#10B981',
    greenLight: 'rgba(16, 185, 129, 0.1)',
    orange: '#F59E0B',
    orangeLight: 'rgba(245, 158, 11, 0.1)',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #D40511, #ff6b6b)',
    gradientAccent: 'linear-gradient(135deg, #FFCC00, #ffd700)',
    gradientBlue: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    gradientPurple: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    gradientDark: 'linear-gradient(135deg, #181512, #2d2d2d)',
  },

  // Espacement
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '60px',
    '4xl': '80px',
    '5xl': '120px',
  },

  // Shadows
  shadows: {
    sm: '0 10px 30px rgba(17, 17, 17, 0.06)',
    md: '0 18px 44px rgba(17, 17, 17, 0.1)',
    lg: '0 30px 80px rgba(17, 17, 17, 0.14)',
    xl: '0 40px 100px rgba(17, 17, 17, 0.18)',
    primary: '0 8px 24px rgba(212, 5, 17, 0.3)',
    primaryLg: '0 12px 35px rgba(212, 5, 17, 0.4)',
    accent: '0 8px 24px rgba(255, 204, 0, 0.3)',
    glow: '0 0 40px rgba(212, 5, 17, 0.2)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  // Border Radius
  borderRadius: {
    sm: '12px',
    md: '18px',
    lg: '24px',
    xl: '32px',
    pill: '999px',
  },

  // Typography
  typography: {
    fontFamily: {
      body: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '44px',
      '6xl': '52px',
      '7xl': '64px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.7,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-Index
  zIndex: {
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    backdrop: 900,
    modal: 1000,
    popover: 1100,
    tooltip: 1200,
  },

  // Blur
  blur: {
    sm: '4px',
    md: '10px',
    lg: '20px',
    xl: '40px',
  },

  // Opacity
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    focus: 0.9,
  },
};

/**
 * Composants de style réutilisables
 */
export const STYLES = {
  // Boutons
  button: {
    base: {
      border: 'none',
      borderRadius: THEME.borderRadius.pill,
      fontWeight: THEME.typography.fontWeight.bold,
      cursor: 'pointer',
      transition: `all ${THEME.transitions.normal}`,
      fontFamily: THEME.typography.fontFamily.body,
      fontSize: THEME.typography.fontSize.sm,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    primary: {
      padding: '14px 32px',
      background: THEME.colors.gradientPrimary,
      color: 'white',
      boxShadow: THEME.shadows.primary,
    },
    secondary: {
      padding: '14px 32px',
      background: 'transparent',
      color: THEME.colors.text,
      border: `2px solid ${THEME.colors.borderStrong}`,
    },
    accent: {
      padding: '14px 32px',
      background: THEME.colors.gradientAccent,
      color: THEME.colors.accentText,
      boxShadow: THEME.shadows.accent,
    },
    small: {
      padding: '10px 20px',
      fontSize: THEME.typography.fontSize.xs,
    },
    large: {
      padding: '18px 44px',
      fontSize: THEME.typography.fontSize.base,
    },
    icon: {
      width: '48px',
      height: '48px',
      padding: 0,
      borderRadius: THEME.borderRadius.md,
    },
  },

  // Cards
  card: {
    base: {
      background: THEME.colors.panelStrong,
      border: `1px solid ${THEME.colors.border}`,
      borderRadius: THEME.borderRadius.md,
      padding: THEME.spacing.xl,
      boxShadow: THEME.shadows.sm,
      transition: `all ${THEME.transitions.normal}`,
    },
    elevated: {
      background: THEME.colors.panelStrong,
      border: `1px solid ${THEME.colors.border}`,
      borderRadius: THEME.borderRadius.md,
      padding: THEME.spacing.xl,
      boxShadow: THEME.shadows.lg,
      transition: `all ${THEME.transitions.normal}`,
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: `blur(${THEME.blur.md})`,
      WebkitBackdropFilter: `blur(${THEME.blur.md})`,
      border: `1px solid ${THEME.colors.border}`,
      borderRadius: THEME.borderRadius.md,
      padding: THEME.spacing.xl,
    },
    gradient: {
      background: THEME.colors.gradientPrimary,
      borderRadius: THEME.borderRadius.md,
      padding: THEME.spacing.xl,
      color: 'white',
    },
  },

  // Inputs
  input: {
    base: {
      width: '100%',
      padding: '12px 16px',
      border: `1px solid ${THEME.colors.border}`,
      borderRadius: THEME.borderRadius.sm,
      fontSize: THEME.typography.fontSize.sm,
      fontFamily: THEME.typography.fontFamily.body,
      transition: `all ${THEME.transitions.normal}`,
      color: THEME.colors.text,
      outline: 'none',
      background: THEME.colors.white,
    },
    focus: {
      borderColor: THEME.colors.primary,
      boxShadow: `0 0 0 3px ${THEME.colors.primaryShadow}`,
    },
    error: {
      borderColor: THEME.colors.primary,
      boxShadow: `0 0 0 3px ${THEME.colors.primaryShadow}`,
    },
  },

  // Typography
  text: {
    h1: {
      fontSize: THEME.typography.fontSize['7xl'],
      fontWeight: THEME.typography.fontWeight.black,
      fontFamily: THEME.typography.fontFamily.display,
      color: THEME.colors.text,
      lineHeight: THEME.typography.lineHeight.tight,
      letterSpacing: THEME.typography.letterSpacing.tight,
    },
    h2: {
      fontSize: THEME.typography.fontSize['6xl'],
      fontWeight: THEME.typography.fontWeight.extrabold,
      fontFamily: THEME.typography.fontFamily.display,
      color: THEME.colors.text,
      lineHeight: THEME.typography.lineHeight.snug,
      letterSpacing: THEME.typography.letterSpacing.tight,
    },
    h3: {
      fontSize: THEME.typography.fontSize['4xl'],
      fontWeight: THEME.typography.fontWeight.bold,
      fontFamily: THEME.typography.fontFamily.display,
      color: THEME.colors.text,
      lineHeight: THEME.typography.lineHeight.snug,
    },
    h4: {
      fontSize: THEME.typography.fontSize['2xl'],
      fontWeight: THEME.typography.fontWeight.bold,
      fontFamily: THEME.typography.fontFamily.display,
      color: THEME.colors.text,
      lineHeight: THEME.typography.lineHeight.normal,
    },
    body: {
      fontSize: THEME.typography.fontSize.base,
      fontFamily: THEME.typography.fontFamily.body,
      color: THEME.colors.text,
      lineHeight: THEME.typography.lineHeight.relaxed,
    },
    small: {
      fontSize: THEME.typography.fontSize.sm,
      fontFamily: THEME.typography.fontFamily.body,
      color: THEME.colors.textSecondary,
      lineHeight: THEME.typography.lineHeight.normal,
    },
    caption: {
      fontSize: THEME.typography.fontSize.xs,
      fontFamily: THEME.typography.fontFamily.body,
      color: THEME.colors.textTertiary,
      lineHeight: THEME.typography.lineHeight.normal,
    },
  },

  // Sections
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${THEME.spacing.lg}`,
  },

  section: {
    padding: `${THEME.spacing['5xl']} ${THEME.spacing['2xl']}`,
  },

  // Glass effect
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: `blur(${THEME.blur.md})`,
    WebkitBackdropFilter: `blur(${THEME.blur.md})`,
  },

  // Gradient text
  gradientText: {
    backgroundImage: THEME.colors.gradientPrimary,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  // Badge
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: THEME.borderRadius.pill,
      fontSize: THEME.typography.fontSize.xs,
      fontWeight: THEME.typography.fontWeight.semibold,
    },
    primary: {
      background: THEME.colors.primaryLight,
      color: THEME.colors.primary,
    },
    accent: {
      background: THEME.colors.accentLight,
      color: THEME.colors.accentText,
    },
    success: {
      background: THEME.colors.successLight,
      color: THEME.colors.success,
    },
  },

  // Avatar
  avatar: {
    sm: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
    },
    md: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
    },
    lg: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
    },
  },

  // Divider
  divider: {
    horizontal: {
      height: '1px',
      background: THEME.colors.border,
      width: '100%',
    },
    vertical: {
      width: '1px',
      background: THEME.colors.border,
      height: '100%',
    },
  },

  // Tooltip
  tooltip: {
    background: THEME.colors.text,
    color: THEME.colors.white,
    padding: '8px 12px',
    borderRadius: THEME.borderRadius.sm,
    fontSize: THEME.typography.fontSize.xs,
    boxShadow: THEME.shadows.lg,
  },
};

/**
 * Animations
 */
export const ANIMATIONS = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes scale {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-slide-in {
    animation: slideIn 0.5s ease-out;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-bounce {
    animation: bounce 2s ease-in-out infinite;
  }

  .animate-scale {
    animation: scale 2s ease-in-out infinite;
  }

  .animate-rotate {
    animation: rotate 1s linear infinite;
  }

  .animate-shimmer {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
  }

  /* Hover effects */
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .hover-scale {
    transition: transform 0.3s ease;
  }

  .hover-scale:hover {
    transform: scale(1.05);
  }

  .hover-glow {
    transition: box-shadow 0.3s ease;
  }

  .hover-glow:hover {
    box-shadow: 0 0 20px rgba(212, 5, 17, 0.3);
  }

  /* Focus effects */
  .focus-ring:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(212, 5, 17, 0.3);
  }

  /* Glass effect */
  .glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .glass-dark {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, #D40511, #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${THEME.colors.bgPrimary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${THEME.colors.borderStrong};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${THEME.colors.textTertiary};
  }

  /* Selection */
  ::selection {
    background: ${THEME.colors.primaryLight};
    color: ${THEME.colors.primary};
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Focus visible */
  *:focus-visible {
    outline: 2px solid ${THEME.colors.primary};
    outline-offset: 2px;
  }
`;

export default THEME;
