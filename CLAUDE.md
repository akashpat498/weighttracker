# WeightTracker — Claude Code guidance

This file is read automatically by Claude Code. Follow these practices when editing, adding features, or refactoring.

## Project overview

**WeightTracker** is a workout-tracking app. The MVP feature set is still being defined — the
repository currently contains the shared infrastructure (navigation shell, theming, storage,
API/server, analytics) and minimal placeholder screens. Build features on top of this scaffold.

## Tech stack

- **Expo** (SDK 54) with **React Native**
- **expo-router** for file-based routing (no React Navigation route config)
- **TypeScript** + **React** 19
- **NativeWind (Tailwind)** for styling (`className` prop)
- **AsyncStorage** for local persistence
- **Gemini / OpenAI** for optional LLM features (server-side only)
- **Upstash Redis** for API rate limiting (optional)
- **PostHog** for analytics (optional)

## Directory structure

```
app/              # Expo Router routes (screens)
  (tabs)/         # Main tab screens (history, log, settings)
  api/            # Server endpoints via Expo's +api.ts convention
components/
  ui/             # Primitive themed components (ThemedText, ThemedView, IconSymbol)
  layout/         # Navigation chrome (HapticTab, CenterTabButton)
  branding/       # Logo and header
contexts/         # React contexts for cross-screen state
services/
  api/            # Client-side API wrappers (apiFetch + per-endpoint modules)
  storage/        # Persistence (Repository interface + AsyncStorage impl)
  analytics/      # Analytics abstraction (interface + PostHog impl)
server/           # Server-side logic called from api/ routes
  auth.ts         # API key validation, client header check, rate limiting
  handlers/       # Request handlers
  llm/            # LLM abstraction (interface + Gemini/OpenAI impls)
hooks/            # Custom React hooks
types/            # TypeScript type definitions
utils/            # Pure functions
constants/        # Theme colors and fonts
docs/features/    # One feature doc per feature/commit
```

## State management & persistence

- **Persistence:** `AsyncStorageWorkoutRepository` (`services/storage/`) implements the
  `WorkoutRepository` interface. Always go through the interface, not AsyncStorage directly.
- `types/workout.ts` holds the core domain types — expand them as the MVP grows; don't use `any`.

## Server / API architecture

- Server endpoints use Expo Router's `+api.ts` convention (e.g. `app/api/health+api.ts`).
- Auth is enforced in `server/auth.ts`: protected requests must have a valid `x-api-key` header
  **and** `X-Client: WeightTracker-iOS/1.0`. Rate limiting is per-IP via Upstash (optional).
- The LLM provider is abstracted behind an `LLMClient` interface (`server/llm/`). Switch providers
  via the `LLM_PROVIDER` env var — don't hard-code a provider in handlers.
- All API calls from the client go through `apiFetch()` in `services/api/client.ts`, which sets the
  auth headers automatically.

## Environment variables

| Variable | Side | Purpose |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Client | Base URL for API calls (empty = local) |
| `EXPO_PUBLIC_WEIGHTTRACKER_API_KEY` | Client | API key sent in `x-api-key` header |
| `WEIGHTTRACKER_API_KEY` | Server only | Expected API key for validation |
| `LLM_PROVIDER` | Server only | `gemini` or `openai` |
| `GEMINI_API_KEY` | Server only | Gemini API key |
| `GEMINI_MODEL` | Server only | e.g. `gemini-2.0-flash` |
| `OPENAI_API_KEY` | Server only | OpenAI API key |
| `OPENAI_MODEL` | Server only | e.g. `gpt-4o` |
| `UPSTASH_REDIS_REST_URL` | Server only | Rate limiting (optional) |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Rate limiting (optional) |
| `EXPO_PUBLIC_POSTHOG_API_KEY` | Client | PostHog project API key (empty = analytics disabled) |
| `EXPO_PUBLIC_POSTHOG_HOST` | Client | PostHog ingest host (e.g. `https://us.i.posthog.com`) |

**Never use server-only variables in client code.** Only `EXPO_PUBLIC_*` vars are safe to reference in `app/`, `components/`, `hooks/`, etc.

## Common commands

```bash
npm run lint        # lint — run before marking a change done
npx expo start      # start the dev server
```

## Routing and app structure

- Routes live under `app/`. File-based routing: `app/(tabs)/history/index.tsx` → `/history`.
- Use `app/(tabs)/` for tab screens; use `_layout.tsx` for layout and tab config.
- Navigate with `expo-router`: `Link`, `router.push()`, `router.back()`, etc. Do **not** add a separate React Navigation stack/tab setup.

## Imports, components, and style

- Use the `@/` path alias for app code. No relative `../../../` imports, no wildcard imports.
- Functional components only. Prefer named exports for shared components/utilities; screens use a default export.
- Style with the `className` prop via NativeWind. Use existing themed primitives (`ThemedText`, `ThemedView`) from `@/components/ui/`; extend them there.
- TypeScript strictly: type props, state, and signatures. Avoid `any`. Fix all lint/TS errors before finishing.

## Do

- Add a feature doc in `docs/features/` for each new feature (`kebab-case-description-YYYY-MM-DD.md`).
- Reuse or extend components in `components/` and hooks in `hooks/`.
- Keep new dependencies minimal and Expo-compatible; prefer Expo modules when available.

## Don't

- Introduce a different router/navigation library; stick to expo-router.
- Use server-only env vars in client-side code.
- Bypass the `WorkoutRepository` interface by calling AsyncStorage directly.
- Hard-code an LLM provider — always go through the `LLMClient` abstraction.
