// Design tokens for consistent styling across the application
export const DESIGN_TOKENS = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    white: '#ffffff',
    black: '#000000',
  },
  
  typography: {
    fontFamilies: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      serif: ['Georgia', 'Times New Roman', 'serif'],
      mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
    },
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    none: '0 0 #0000',
  },
  
  breakpoints: {
    mobile: { min: 0, max: 767, width: 375 },
    tablet: { min: 768, max: 1023, width: 768 },
    desktop: { min: 1024, max: Infinity, width: 1200 },
  },
}

// Helper functions to get design token values
export const getColor = (path: string): string => {
  const keys = path.split('.')
  let value: any = DESIGN_TOKENS.colors
  
  for (const key of keys) {
    value = value?.[key]
  }
  
  return value || '#000000'
}

export const getFontSize = (size: keyof typeof DESIGN_TOKENS.typography.fontSizes): string => {
  return DESIGN_TOKENS.typography.fontSizes[size] || DESIGN_TOKENS.typography.fontSizes.base
}

export const getSpacing = (size: keyof typeof DESIGN_TOKENS.spacing): string => {
  return DESIGN_TOKENS.spacing[size] || '0'
}

export const getBorderRadius = (size: keyof typeof DESIGN_TOKENS.borderRadius): string => {
  return DESIGN_TOKENS.borderRadius[size] || DESIGN_TOKENS.borderRadius.base
}

export const getShadow = (size: keyof typeof DESIGN_TOKENS.shadows): string => {
  return DESIGN_TOKENS.shadows[size] || DESIGN_TOKENS.shadows.none
}

// Default styles for different element types
export const DEFAULT_ELEMENT_STYLES = {
  text: {
    fontSize: DESIGN_TOKENS.typography.fontSizes.base,
    fontFamily: DESIGN_TOKENS.typography.fontFamilies.sans.join(', '),
    fontWeight: DESIGN_TOKENS.typography.fontWeights.normal,
    lineHeight: DESIGN_TOKENS.typography.lineHeights.normal,
    color: DESIGN_TOKENS.colors.gray[900],
  },
  
  heading: {
    fontSize: DESIGN_TOKENS.typography.fontSizes['2xl'],
    fontFamily: DESIGN_TOKENS.typography.fontFamilies.sans.join(', '),
    fontWeight: DESIGN_TOKENS.typography.fontWeights.bold,
    lineHeight: DESIGN_TOKENS.typography.lineHeights.tight,
    color: DESIGN_TOKENS.colors.gray[900],
    marginBottom: DESIGN_TOKENS.spacing[4],
  },
  
  button: {
    fontSize: DESIGN_TOKENS.typography.fontSizes.base,
    fontFamily: DESIGN_TOKENS.typography.fontFamilies.sans.join(', '),
    fontWeight: DESIGN_TOKENS.typography.fontWeights.medium,
    padding: `${DESIGN_TOKENS.spacing[3]} ${DESIGN_TOKENS.spacing[6]}`,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    backgroundColor: DESIGN_TOKENS.colors.primary[600],
    color: DESIGN_TOKENS.colors.white,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  
  container: {
    padding: DESIGN_TOKENS.spacing[4],
    backgroundColor: DESIGN_TOKENS.colors.white,
  },
  
  section: {
    padding: `${DESIGN_TOKENS.spacing[12]} ${DESIGN_TOKENS.spacing[4]}`,
    backgroundColor: DESIGN_TOKENS.colors.white,
  },
  
  navbar: {
    padding: `${DESIGN_TOKENS.spacing[4]} ${DESIGN_TOKENS.spacing[6]}`,
    backgroundColor: DESIGN_TOKENS.colors.white,
    borderBottom: `1px solid ${DESIGN_TOKENS.colors.gray[200]}`,
    boxShadow: DESIGN_TOKENS.shadows.sm,
  },
}