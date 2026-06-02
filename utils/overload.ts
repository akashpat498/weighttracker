import type { ExerciseEntry, SavedSession, SetEntry } from '@/types/session';

/** Epley estimated one-rep max. Returns null for bodyweight (null) sets. */
export function estimateOneRepMax(weightKg: number | null, reps: number): number | null {
  if (weightKg === null || reps <= 0) return null;
  return weightKg * (1 + reps / 30);
}

/** The heaviest weighted set in an entry (ignores bodyweight sets). */
export function topSet(entry: ExerciseEntry): SetEntry | null {
  const weighted = entry.sets.filter((s) => s.weightKg !== null);
  if (weighted.length === 0) return null;
  return weighted.reduce((best, s) =>
    (s.weightKg as number) > (best.weightKg as number) ? s : best
  );
}

/** Total volume (Σ weight × reps) for an entry; bodyweight sets count as 0 weight. */
export function entryVolumeKg(entry: ExerciseEntry): number {
  return entry.sets.reduce((sum, s) => sum + (s.weightKg ?? 0) * s.reps, 0);
}

export interface ProgressPoint {
  /** performedAt ISO timestamp of the session. */
  date: string;
  /** Heaviest set weight (kg), or null if the exercise was bodyweight-only that day. */
  topSetKg: number | null;
  /** Best estimated 1RM (kg) across the entry's sets, or null. */
  est1RMKg: number | null;
  /** Total volume (kg) for the exercise that session. */
  volumeKg: number;
}

/** Merge all entries for one exercise within a session into a single point. */
function pointForSession(session: SavedSession, entries: ExerciseEntry[]): ProgressPoint {
  let topSetKg: number | null = null;
  let est1RMKg: number | null = null;
  let volumeKg = 0;

  for (const entry of entries) {
    const top = topSet(entry);
    if (top && (topSetKg === null || (top.weightKg as number) > topSetKg)) {
      topSetKg = top.weightKg;
    }
    for (const s of entry.sets) {
      const orm = estimateOneRepMax(s.weightKg, s.reps);
      if (orm !== null && (est1RMKg === null || orm > est1RMKg)) {
        est1RMKg = orm;
      }
    }
    volumeKg += entryVolumeKg(entry);
  }

  return { date: session.performedAt, topSetKg, est1RMKg, volumeKg };
}

/** Chronological (ascending) progress series for one exercise. */
export function buildExerciseProgress(
  sessions: SavedSession[],
  exerciseId: string
): ProgressPoint[] {
  const points: ProgressPoint[] = [];
  for (const session of sessions) {
    const entries = session.entries.filter((e) => e.exerciseId === exerciseId);
    if (entries.length > 0) {
      points.push(pointForSession(session, entries));
    }
  }
  return points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * The most recent entry for an exercise, matched by name (case-insensitive).
 * Used to pre-fill the Log screen with last time's sets. Assumes `sessions` is
 * sorted most-recent-first (as the repository returns them).
 */
export function getLastEntryForExercise(
  sessions: SavedSession[],
  exerciseName: string
): ExerciseEntry | null {
  const target = exerciseName.trim().toLowerCase();
  for (const session of sessions) {
    const entry = session.entries.find(
      (e) => e.exerciseName.trim().toLowerCase() === target
    );
    if (entry) return entry;
  }
  return null;
}

export type TrendDirection = 'up' | 'flat' | 'down';

export interface ExerciseTrend {
  /** Change in top-set weight (kg) from the previous to the latest session. */
  deltaKg: number;
  direction: TrendDirection;
}

/** Trend of top-set weight: latest weighted session vs the one before it. */
export function exerciseTrend(sessions: SavedSession[], exerciseId: string): ExerciseTrend {
  const weighted = buildExerciseProgress(sessions, exerciseId).filter(
    (p) => p.topSetKg !== null
  );
  if (weighted.length < 2) return { deltaKg: 0, direction: 'flat' };

  const latest = weighted[weighted.length - 1].topSetKg as number;
  const prev = weighted[weighted.length - 2].topSetKg as number;
  const deltaKg = latest - prev;
  const direction: TrendDirection = deltaKg > 0.01 ? 'up' : deltaKg < -0.01 ? 'down' : 'flat';
  return { deltaKg, direction };
}
