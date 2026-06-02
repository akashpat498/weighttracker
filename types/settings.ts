import type { Unit } from './units';

export interface AppSettings {
  unit: Unit;
}

export const DEFAULT_SETTINGS: AppSettings = {
  unit: 'lb',
};
