import { useCallback, useEffect, useState } from 'react';

import { exerciseRepository } from '@/services/storage';
import type { Exercise } from '@/types/exercise';

interface UseExerciseCatalog {
  exercises: Exercise[];
  loading: boolean;
  refresh: () => Promise<void>;
}

/** Loads the exercise catalog (alphabetical) for autocomplete and the Progress list. */
export function useExerciseCatalog(): UseExerciseCatalog {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await exerciseRepository.getExercises();
    setExercises(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { exercises, loading, refresh };
}
