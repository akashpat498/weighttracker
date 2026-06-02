import type { AppSettings } from '@/types/settings';
import type { Unit } from '@/types/units';

/** Repository interface for app settings (currently just the weight unit). */
export interface SettingsRepository {
  getSettings(): Promise<AppSettings>;
  setUnit(unit: Unit): Promise<AppSettings>;
}
