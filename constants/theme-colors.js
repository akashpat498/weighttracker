/**
 * Single source of truth for app theme colors.
 * Edit this file to change the entire app theme.
 *
 * Used by:
 *   - constants/theme.ts → Colors used in React components (Colors.tint, etc.)
 *   - tailwind.config.js → Tailwind classes (bg-app-tint, text-app-muted, etc.)
 *
 * Palette — "strength" theme:
 *   Ink:    #11181C / #1F2933
 *   Slate:  #64748B / #94A3B8
 *   Ember:  #F97316 / #EA580C / #FB923C
 *
 * Note: app.json splash screen backgroundColor should match `background`.
 */

module.exports = {
  background: '#F4F6F8',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: '#11181C',
  muted: '#64748B',
  icon: '#64748B',
  tint: '#F97316',
  tintContrast: '#FFFFFF',
  tabIconSelected: '#F97316',
  tabIconDefault: '#64748B',
  /** Chip/form emphasis */
  chip: '#EEF2F6',
  chipSelected: '#11181C',
  chipText: '#11181C',
  /** Accent for primary CTAs */
  accent: '#F97316',
  accentContrast: '#FFFFFF',
  /** Link text color */
  link: '#EA580C',
  /** Image preview/crop area */
  previewBg: '#11181C',
};
