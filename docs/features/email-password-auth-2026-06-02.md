# Email/password auth (Supabase)

_Implemented 2026-06-02._

Adds a sign-in gate backed by Supabase Auth. This is the first half of cloud sync: it
establishes a per-user identity (`user_id`) that the upcoming database work will key workout
data to. No app data is in the cloud yet — sessions still live in AsyncStorage.

## Why email + password

We evaluated phone (SMS) and email-OTP first. Both added real setup cost on Expo: SMS needs a
paid provider + US A2P 10DLC; email-OTP needs custom SMTP to put a code in the email (Supabase's
default email is a magic link, not a code). For a personal app, **email + password with email
confirmation disabled** is the quickest reliable path — no SMTP, no templates, works in Expo Go —
while still giving a real, multi-device account. Passwordless can be revisited (with SMTP) before a
public launch.

## What shipped

- **`services/auth/supabase-client.ts`** — Supabase client using AsyncStorage for session storage;
  exported as `null` (with `isSupabaseConfigured`) when env vars are missing, so the app shows a
  config notice instead of crashing. Anon/publishable key only — never the secret key.
- **`contexts/auth-context.tsx`** — `AuthProvider` / `useAuth`: tracks the session via
  `onAuthStateChange`, exposes `signIn`, `signUp`, `signOut`, plus `loading` and `configured`.
- **`app/login.tsx`** — email + password screen with a sign-in / create-account toggle.
- **Auth gate** in `app/_layout.tsx` (`RootNavigator`): redirects signed-out users to `/login`,
  signed-in users away from it; hides the splash once the session resolves.
- **Settings** (`app/settings.tsx`) — shows the signed-in email and a Sign out action.

## Configuration

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Publishable/anon key (safe to ship; RLS enforces access) |

Supabase setup: **Authentication → Providers → Email → disable "Confirm email"** so `signUp`
returns a session immediately without sending a confirmation email. `EXPO_PUBLIC_*` vars are inlined
at build time, so restart with `npx expo start -c` after editing `.env`.

Deps added: `@supabase/supabase-js`, `react-native-url-polyfill`.

## Not in this change (next)

Postgres schema (`exercises / splits / sessions / exercise_entries / sets`) + RLS, and swapping the
AsyncStorage repositories for Supabase-backed ones behind the existing storage interfaces.
