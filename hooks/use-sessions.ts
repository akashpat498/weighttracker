import { useCallback, useEffect, useState } from 'react';

import { sessionRepository } from '@/services/storage';
import type { SavedSession } from '@/types/session';

interface UseSessions {
  sessions: SavedSession[];
  loading: boolean;
  refresh: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

/** Loads saved sessions (most-recent-first) and exposes refresh + delete. */
export function useSessions(): UseSessions {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await sessionRepository.getSessions();
    setSessions(next);
    setLoading(false);
  }, []);

  const deleteSession = useCallback(
    async (id: string) => {
      await sessionRepository.deleteSession(id);
      await refresh();
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { sessions, loading, refresh, deleteSession };
}
