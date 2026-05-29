# Agent instructions for WeightTracker

Guidance for AI agents working in this codebase. Follow these practices when editing, adding features, or refactoring.

## Tech stack

- **Expo** (SDK 54) with **React Native**
- **expo-router** for file-based routing (no React Navigation route config)
- **TypeScript**
- **React** 19

## Conventions

### Routing and app structure

- Routes live under `app/`. File-based routing: `app/(tabs)/history/index.tsx` → `/history`.
- Use `app/(tabs)/` for tab screens; use `_layout.tsx` for layout and tab config.
- Navigate with `expo-router`: `Link`, `router.push()`, `router.back()`, etc. Do not add separate React Navigation stack/tab setup.

### Imports and paths

- Use the `@/` path alias for app code (e.g. `@/components/...`, `@/constants/...`, `@/hooks/...`).
- Prefer named exports for components and utilities unless a file has a single default (e.g. a screen).
- Do not use wildcard imports (`import * as Foo from 'module'`). Use named imports instead.

### Components and styling

- Use functional components only.
- **NativeWind (Tailwind)** is used for styling: use the `className` prop on React Native components. See [global.css](global.css) and [tailwind.config.js](tailwind.config.js). `StyleSheet` is fine where it makes sense.
- Use existing themed primitives (`ThemedText`, `ThemedView`) from `@/components/ui/` when they fit; extend or add new ones in `components/ui/` when needed.

### Code style

- Use TypeScript strictly: type props, state, and function signatures. Avoid `any`.
- Follow existing patterns in the file you're editing.
- Run `npm run lint` before considering a change done; fix any new lint issues.

## Do

- Add a feature doc in `docs/features/` for each new feature (one doc per commit).
- Add or edit screens under `app/` and use expo-router APIs for navigation.
- Reuse or extend components in `components/` and hooks in `hooks/`.
- Keep new dependencies minimal and Expo-compatible; prefer Expo modules when available.

## Don't

- Introduce a different router or navigation library; stick to expo-router.
- Use relative imports like `../../../components/` when `@/components/` is available.
- Add untyped or loosely typed APIs; keep types accurate and up to date.
- Ignore lint or TypeScript errors; resolve them as part of the change.
