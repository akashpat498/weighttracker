import type { Exercise } from '@/types/exercise';

/**
 * Repository interface for the exercise catalog. `upsertByName` is the key method:
 * it reuses an existing exercise (case-insensitive name match) or creates a new one,
 * so free-typed names stay consistent and chartable across sessions.
 */
export interface ExerciseRepository {
  getExercises(): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | null>;
  upsertByName(name: string): Promise<Exercise>;
  deleteExercise(id: string): Promise<void>;
}
