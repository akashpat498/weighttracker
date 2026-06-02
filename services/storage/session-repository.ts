import type { EditableSession, SavedSession } from '@/types/session';

/**
 * Repository interface for workout-session persistence. Implementations can use
 * AsyncStorage (local-only), a remote database, or a hybrid approach.
 * Swap the implementation in services/storage/index.ts to change backing store.
 *
 * Note: the MVP is view + delete only — there is intentionally no update method.
 */
export interface SessionRepository {
  saveSession(session: EditableSession): Promise<SavedSession>;
  getSessions(): Promise<SavedSession[]>;
  getSessionById(id: string): Promise<SavedSession | null>;
  deleteSession(id: string): Promise<void>;
}
