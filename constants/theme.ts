/**
 * Unified minimal theme – single mode for the entire app.
 * Colors are defined in theme-colors.js (single source of truth).
 */

import { Platform } from 'react-native';

const themeColors = require('./theme-colors.js');

export const Colors = {
  background: themeColors.background,
  surface: themeColors.surface,
  border: themeColors.border,
  text: themeColors.text,
  muted: themeColors.muted,
  icon: themeColors.icon,
  tint: themeColors.tint,
  tintContrast: themeColors.tintContrast,
  tabIconSelected: themeColors.tabIconSelected,
  tabIconDefault: themeColors.tabIconDefault,
  chip: themeColors.chip,
  chipSelected: themeColors.chipSelected,
  chipText: themeColors.chipText,
  accent: themeColors.accent,
  accentContrast: themeColors.accentContrast,
  link: themeColors.link,
  previewBg: themeColors.previewBg,
} as const;

/** Monospace font (IBM Plex Mono) – loaded in root layout */
export const Fonts = {
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemiBold: 'IBMPlexMono_600SemiBold',
  monoBold: 'IBMPlexMono_700Bold',
  ...Platform.select({
    ios: {
      sans: 'system-ui',
      serif: 'ui-serif',
      rounded: 'ui-rounded',
    },
    default: {
      sans: 'normal',
      serif: 'serif',
      rounded: 'normal',
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    },
  }),
};
