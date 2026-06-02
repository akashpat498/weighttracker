# MVP strength tracker

_Implemented 2026-06-01. Plan: `~/.claude/plans/lets-plan-the-entire-hidden-wombat.md`.
Requirements: `mvp-requirements-2026-05-29.md`._

Builds the strength-training MVP centered on progressive overload, on top of the existing
expo-router + NativeWind scaffold.

## What shipped

- **3 tabs** (`app/(tabs)/_layout.tsx`): **Progress** (home/left) · **Log** (center +) ·
  **History** (right). Settings is a **root modal** (`app/settings.tsx`), opened by the gear icon
  in the Progress and History headers. Default landing redirects to Progress.
- **Progress** (`progress/index.tsx`): per-exercise trend list → `progress/exercise/[id].tsx`,
  charting **Est 1RM / Top set / Volume** over time (react-native-gifted-charts).
- **History** (`history/index.tsx`): reverse-chrono session list → `history/session/[id].tsx`
  detail with unit-formatted sets and **delete** (view + delete only — no edit in MVP).
- **Log** (`app/(tabs)/log/index.tsx`): free-typed exercises with catalog autocomplete, sets as
  weight × reps, bodyweight toggle, per-exercise/session notes, split picker that pre-fills, and
  prefill-from-last-time. Save upserts exercises into the catalog, optionally creates a split, and
  persists the session.
- **Settings** (`app/settings.tsx`): lb/kg toggle via `SettingsProvider`.

## Domain & storage

- Types: `types/{units,exercise,split,session,settings}.ts`. Sessions → exercise entries → sets;
  `weightKg: number | null` (null = bodyweight).
- Repositories (`services/storage/`): `session`, `split`, `exercise` (`upsertByName`), `settings` —
  each an interface + AsyncStorage impl, wired as singletons in `index.ts`.
- Weights stored canonically in **kg**; `utils/units.ts` converts for display so the unit toggle
  never mutates history.
- `utils/overload.ts`: Epley 1RM, top set, volume, `buildExerciseProgress`, `getLastEntryForExercise`
  (prefill), `exerciseTrend` (Progress badges).

## State

- `contexts/settings-context.tsx` (`useSettings`) wraps the app in `app/_layout.tsx`.
- Hooks: `use-sessions`, `use-exercise-catalog`, `use-session-draft` (reducer driving the Log form).

## Analytics

`session_logged`, `session_deleted`, `exercise_progress_viewed` via the `BaseAnalyticsService`
helpers (no-op when PostHog is unconfigured).

## Dependencies

`react-native-gifted-charts` + `react-native-svg` for charts, plus **`expo-linear-gradient`**
(gifted-charts eagerly `require`s a gradient package when its chart modules load; the Expo SDK
build ships expo-linear-gradient, so this stays Expo Go compatible — no custom dev build needed).

## Not in MVP (future)

Editing past sessions, dedicated split/exercise management screens, RPE/rest timers, cardio,
body-weight tracking, accounts/cloud sync.
