import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

import type { Exercise } from '@/types/exercise';

import type { ExerciseRepository } from './exercise-repository';

const EXERCISES_KEY = '@weighttracker/exercises';

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

export class AsyncStorageExerciseRepository implements ExerciseRepository {
  async getExercises(): Promise<Exercise[]> {
    const raw = await AsyncStorage.getItem(EXERCISES_KEY);
    if (!raw) return [];

    try {
      const parsed: Exercise[] = JSON.parse(raw);
      const exercises = Array.isArray(parsed) ? parsed : [];
      return exercises.sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      return [];
    }
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const exercises = await this.getExercises();
    return exercises.find((e) => e.id === id) ?? null;
  }

  async upsertByName(name: string): Promise<Exercise> {
    const trimmed = name.trim();
    const exercises = await this.getExercises();
    const existing = exercises.find((e) => normalize(e.name) === normalize(trimmed));
    if (existing) return existing;

    const exercise: Exercise = {
      id: uuidv4(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    };
    exercises.push(exercise);
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
    return exercise;
  }

  async deleteExercise(id: string): Promise<void> {
    const exercises = await this.getExercises();
    const filtered = exercises.filter((e) => e.id !== id);
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(filtered));
  }
}
