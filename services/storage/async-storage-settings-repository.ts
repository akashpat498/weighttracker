import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, type AppSettings } from '@/types/settings';
import type { Unit } from '@/types/units';

import type { SettingsRepository } from './settings-repository';

const SETTINGS_KEY = '@weighttracker/settings';

export class AsyncStorageSettingsRepository implements SettingsRepository {
  async getSettings(): Promise<AppSettings> {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };

    try {
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  async setUnit(unit: Unit): Promise<AppSettings> {
    const settings = await this.getSettings();
    const updated: AppSettings = { ...settings, unit };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }
}
