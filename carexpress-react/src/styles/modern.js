// Enhanced styling components for modern UI

export const ModernStyles = {
  // Animations
  animationFadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,

  // Common patterns
  glass: (opacity = 0.8) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }),

  shadow: {
    sm: '0 10px 30px rgba(17, 17, 17, 0.06)',
    md: '0 18px 44px rgba(17, 17, 17, 0.1)',
    lg: '0 30px 80px rgba(17, 17, 17, 0.14)',
    red: '0 8px 24px rgba(212, 5, 17, 0.3)',
  },

  gradient: {
    primary: 'linear-gradient(135deg, var(--loc), #ff6b6b)',
    accent: 'linear-gradient(135deg, var(--vnt), #ffd700)',
  },

  // Button variants
  buttonBase: {
    border: 'none',
    borderRadius: '999px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'var(--font)',
  },

  buttonPrimary: {
    padding: '12px 28px',
    background: 'var(--loc)',
    color: 'white',
    fontSize: '14px',
    boxShadow: '0 8px 24px rgba(212, 5, 17, 0.3)',
  },

  buttonSecondary: {
    padding: '12px 28px',
    background: 'transparent',
    color: 'var(--text)',
    border: '2px solid var(--border2)',
    fontSize: '14px',
  },

  // Card styling
  card: {
    background: 'var(--panel-strong)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.3s ease',
  },

  // Input styling
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontFamily: 'var(--font)',
    transition: 'all 0.3s ease',
    color: 'var(--text)',
  },

  // Typography
  heading: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    color: 'var(--text)',
  },

  text: {
    fontFamily: 'var(--font)',
    color: 'var(--text)',
  },
};

export default ModernStyles;
