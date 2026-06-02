/**
 * Core workout-session types.
 *
 * Weights are stored canonically in **kg** (`weightKg`) so the lb/kg display
 * toggle never rewrites history. A `null` weight means a bodyweight set
 * (track reps only).
 */

export interface SetEntry {
  id: string;
  /** Weight in kilograms, or `null` for a bodyweight set. */
  weightKg: number | null;
  reps: number;
}

export interface ExerciseEntry {
  id: string;
  /** References an Exercise in the catalog. */
  exerciseId: string;
  /** Denormalized name, kept for display and resilience if the catalog changes. */
  exerciseName: string;
  sets: SetEntry[];
  notes?: string;
}

/** A session being created/edited, before it has an id. */
export interface EditableSession {
  /** Optional split this session was started from. */
  splitId?: string;
  /** ISO timestamp for when the workout was performed. */
  performedAt: string;
  notes?: string;
  entries: ExerciseEntry[];
}

/** A session that has been persisted. */
export interface SavedSession extends EditableSession {
  id: string;
  createdAt: string;
}
