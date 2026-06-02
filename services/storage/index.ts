import { AsyncStorageExerciseRepository } from './async-storage-exercise-repository';
import { AsyncStorageSessionRepository } from './async-storage-session-repository';
import { AsyncStorageSettingsRepository } from './async-storage-settings-repository';
import { AsyncStorageSplitRepository } from './async-storage-split-repository';
import type { ExerciseRepository } from './exercise-repository';
import type { SessionRepository } from './session-repository';
import type { SettingsRepository } from './settings-repository';
import type { SplitRepository } from './split-repository';

export type { SessionRepository } from './session-repository';
export type { SplitRepository, SplitInput } from './split-repository';
export type { ExerciseRepository } from './exercise-repository';
export type { SettingsRepository } from './settings-repository';

export const sessionRepository: SessionRepository = new AsyncStorageSessionRepository();
export const splitRepository: SplitRepository = new AsyncStorageSplitRepository();
export const exerciseRepository: ExerciseRepository = new AsyncStorageExerciseRepository();
export const settingsRepository: SettingsRepository = new AsyncStorageSettingsRepository();
