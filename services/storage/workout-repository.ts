import type { EditableWorkout, SavedWorkout } from '@/types/workout';

/**
 * Repository interface for workout persistence. Implementations can use
 * AsyncStorage (local-only), a remote database, or a hybrid approach.
 * Swap the implementation in services/storage/index.ts to change backing store.
 */
export interface WorkoutRepository {
  saveWorkout(workout: EditableWorkout): Promise<SavedWorkout>;
  updateWorkout(id: string, workout: EditableWorkout): Promise<SavedWorkout>;
  getWorkouts(): Promise<SavedWorkout[]>;
  getWorkoutById(id: string): Promise<SavedWorkout | null>;
  deleteWorkout(id: string): Promise<void>;
}
