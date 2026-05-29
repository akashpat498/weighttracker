import type { WorkoutRepository } from './workout-repository';

import { AsyncStorageWorkoutRepository } from './async-storage-workout-repository';

export type { WorkoutRepository } from './workout-repository';
export type { SavedWorkout, EditableWorkout } from '@/types/workout';

export const workoutRepository: WorkoutRepository = new AsyncStorageWorkoutRepository();
