import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

import type { EditableWorkout, SavedWorkout } from '@/types/workout';

import type { WorkoutRepository } from './workout-repository';

const WORKOUTS_KEY = '@weighttracker/workouts';

export class AsyncStorageWorkoutRepository implements WorkoutRepository {
  async saveWorkout(workout: EditableWorkout): Promise<SavedWorkout> {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const saved: SavedWorkout = { ...workout, id, createdAt };

    const workouts = await this.getWorkouts();
    workouts.unshift(saved);
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));

    return saved;
  }

  async updateWorkout(id: string, workout: EditableWorkout): Promise<SavedWorkout> {
    const workouts = await this.getWorkouts();
    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Workout ${id} not found`);
    }
    const existing = workouts[index];
    const updated: SavedWorkout = {
      ...workout,
      id: existing.id,
      createdAt: existing.createdAt,
    };
    workouts[index] = updated;
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    return updated;
  }

  async getWorkouts(): Promise<SavedWorkout[]> {
    const raw = await AsyncStorage.getItem(WORKOUTS_KEY);
    if (!raw) return [];

    try {
      const parsed: SavedWorkout[] = JSON.parse(raw);
      const workouts = Array.isArray(parsed) ? parsed : [];
      return workouts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  }

  async getWorkoutById(id: string): Promise<SavedWorkout | null> {
    const workouts = await this.getWorkouts();
    return workouts.find((w) => w.id === id) ?? null;
  }

  async deleteWorkout(id: string): Promise<void> {
    const workouts = await this.getWorkouts();
    const filtered = workouts.filter((w) => w.id !== id);
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(filtered));
  }
}
