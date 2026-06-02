import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { settingsRepository } from '@/services/storage';
import { DEFAULT_SETTINGS } from '@/types/settings';
import type { Unit } from '@/types/units';

interface SettingsContextValue {
  unit: Unit;
  /** True until settings have loaded from storage. */
  loading: boolean;
  setUnit: (unit: Unit) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnitState] = useState<Unit>(DEFAULT_SETTINGS.unit);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    settingsRepository.getSettings().then((settings) => {
      if (active) {
        setUnitState(settings.unit);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const setUnit = useCallback((next: Unit) => {
    setUnitState(next); // optimistic
    settingsRepository.setUnit(next);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ unit, loading, setUnit }),
    [unit, loading, setUnit]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
