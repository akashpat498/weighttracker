import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

import type { Split } from '@/types/split';

import type { SplitInput, SplitRepository } from './split-repository';

const SPLITS_KEY = '@weighttracker/splits';

export class AsyncStorageSplitRepository implements SplitRepository {
  async saveSplit(input: SplitInput): Promise<Split> {
    const split: Split = {
      id: uuidv4(),
      name: input.name.trim(),
      exerciseNames: input.exerciseNames,
      createdAt: new Date().toISOString(),
    };

    const splits = await this.getSplits();
    splits.unshift(split);
    await AsyncStorage.setItem(SPLITS_KEY, JSON.stringify(splits));

    return split;
  }

  async getSplits(): Promise<Split[]> {
    const raw = await AsyncStorage.getItem(SPLITS_KEY);
    if (!raw) return [];

    try {
      const parsed: Split[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async getSplitById(id: string): Promise<Split | null> {
    const splits = await this.getSplits();
    return splits.find((s) => s.id === id) ?? null;
  }

  async deleteSplit(id: string): Promise<void> {
    const splits = await this.getSplits();
    const filtered = splits.filter((s) => s.id !== id);
    await AsyncStorage.setItem(SPLITS_KEY, JSON.stringify(filtered));
  }
}
