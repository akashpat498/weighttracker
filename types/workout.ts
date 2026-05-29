/**
 * Core domain types for WeightTracker.
 *
 * This is a minimal starting point so the storage layer and screens compile.
 * Expand these once the MVP feature set is locked in (e.g. exercises, sets,
 * reps, weight, duration, body metrics).
 */

/** A workout being created/edited, before it has an id. */
export interface EditableWorkout {
  /** Display title, e.g. "Push Day" or "Morning Run". */
  title: string;
  /** ISO date string for when the workout was performed. */
  performedAt: string;
  /** Free-form notes. */
  notes?: string;
}

/** A workout that has been persisted. */
export interface SavedWorkout extends EditableWorkout {
  id: string;
  createdAt: string;
}
