export const typography = {
  // Font families
  primary: 'SpaceGrotesk-Regular',
  bold: 'SpaceGrotesk-Bold',
  medium: 'SpaceGrotesk-Medium',
  light: 'SpaceGrotesk-Light',
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Text style presets
export const textPresets = {
  h1: {
    fontFamily: typography.bold,
    fontSize: typography.sizes.xxxl,
    lineHeight: typography.sizes.xxxl * typography.lineHeights.tight,
  },
  h2: {
    fontFamily: typography.bold,
    fontSize: typography.sizes.xxl,
    lineHeight: typography.sizes.xxl * typography.lineHeights.tight,
  },
  h3: {
    fontFamily: typography.medium,
    fontSize: typography.sizes.xl,
    lineHeight: typography.sizes.xl * typography.lineHeights.normal,
  },
  body: {
    fontFamily: typography.primary,
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * typography.lineHeights.normal,
  },
  bodySmall: {
    fontFamily: typography.primary,
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  caption: {
    fontFamily: typography.primary,
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
  button: {
    fontFamily: typography.medium,
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * typography.lineHeights.tight,
  },
} as const;

