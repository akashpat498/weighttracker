const themeColors = require('./constants/theme-colors.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBMPlexMono_400Regular', 'monospace'],
        'mono-medium': ['IBMPlexMono_500Medium', 'monospace'],
        'mono-semibold': ['IBMPlexMono_600SemiBold', 'monospace'],
        'mono-bold': ['IBMPlexMono_700Bold', 'monospace'],
      },
      colors: {
        app: {
          bg: themeColors.background,
          surface: themeColors.surface,
          border: themeColors.border,
          text: themeColors.text,
          muted: themeColors.muted,
          icon: themeColors.icon,
          tint: themeColors.tint,
          'tint-contrast': themeColors.tintContrast,
          chip: themeColors.chip,
          'chip-selected': themeColors.chipSelected,
          'chip-text': themeColors.chipText,
          accent: themeColors.accent,
          'accent-contrast': themeColors.accentContrast,
          link: themeColors.link,
        },
      },
    },
  },
  plugins: [],
};
