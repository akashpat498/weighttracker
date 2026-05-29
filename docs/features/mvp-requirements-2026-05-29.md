# WeightTracker MVP — Requirements

_Captured 2026-05-29. Source: product owner._

## Vision

A strength-training tracker built around **progressive overload** — making it easy to see whether
the weight/reps/volume you put on a given exercise is trending up over time. This is the gap the
owner sees in most gym apps.

## Scope (MVP)

In scope:

- **Strength / lifting only.** No cardio, no body-metric tracking in the MVP.
- **Workout splits** as reusable templates (e.g. Push / Pull / Legs).
- **Custom exercises** — the user can add their own; no fixed library required.
- **Sessions** — a workout performed on a date, optionally tied to a split.
- **Sets** per exercise per session: weight, reps, and notes — all numbers user-customizable.
- **Free-typing log flow** (see below).
- **Progress charts** + **workout history list** as the payoff.
- **Switchable units** (lb / kg) in settings.
- **Local-only** storage (AsyncStorage). No login, no cloud sync.

Out of scope (later): cardio, body-weight/measurements, accounts/cloud sync, social, LLM
natural-language entry, PR badges (charts will surface progress implicitly for now).

## Logging flow (free typing)

Per the chosen design — type as you go, no library to maintain:

```
Log
──────────────
Exercise: [Bench Press     ]
  135 x 8   135 x 8   +set
Exercise: [Squat          ]
  185 x 5   +set
+ Add exercise
```

- Type/confirm an exercise name (reuse if it matches an existing one, case-insensitive).
- Add sets to it as `weight x reps`; `+set` adds another.
- `+ Add exercise` adds the next exercise to the session.
- Optional per-exercise and per-session notes.
- Optionally start a session from a split, which pre-fills its exercise names.

## Data model

Stored locally, all weights persisted in a canonical unit (kg) and converted for display so the
unit toggle never mutates history.

```
Split            { id, name, exerciseNames: string[], createdAt }
Exercise         { id, name, createdAt }            // user catalog, reused across sessions
Session          { id, splitId?, performedAt, notes?, createdAt, entries: ExerciseEntry[] }
ExerciseEntry    { exerciseId, exerciseName, notes?, sets: SetEntry[] }
SetEntry         { weightKg: number, reps: number, notes? }
Settings         { unit: 'lb' | 'kg' }
```

This extends `types/workout.ts` and the `WorkoutRepository` interface already in the scaffold
(rename `Workout*` → `Session*`, add `SplitRepository` / `ExerciseRepository` or fold into one
repository).

## Progressive-overload analytics

Per exercise, computed from session history:

- **Top-set weight** over time (heaviest set per session).
- **Estimated 1RM** over time via Epley: `weight * (1 + reps/30)`.
- **Total volume** over time: `Σ weight × reps` per session.
- History list shows each session; opening one shows its exercises and sets.

## Screens (maps to existing tab shell)

- **History** tab — reverse-chronological session list; tap to view a session.
- **Log** tab (center +) — free-typing session entry; pick a split to pre-fill.
- **Settings** tab — unit toggle (lb/kg), manage splits & exercises.
- **Exercise detail / progress** — charts for a single exercise (reached from history or settings).

## Open questions

- Chart library: a lightweight RN chart (e.g. `react-native-gifted-charts` or `victory-native`) —
  pick one when building the analytics screen.
- Rest timer / supersets — assumed out of scope for MVP; confirm.
