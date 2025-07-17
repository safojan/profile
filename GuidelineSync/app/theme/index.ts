export * from './colors';
export * from './typography';
export * from './spacing';

import { colors } from './colors';
import { typography, textPresets } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const theme = {
  colors,
  typography,
  textPresets,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;

