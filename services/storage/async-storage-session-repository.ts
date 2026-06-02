import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

import type { EditableSession, SavedSession } from '@/types/session';

import type { SessionRepository } from './session-repository';

const SESSIONS_KEY = '@weighttracker/sessions';

export class AsyncStorageSessionRepository implements SessionRepository {
  async saveSession(session: EditableSession): Promise<SavedSession> {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const saved: SavedSession = { ...session, id, createdAt };

    const sessions = await this.getSessions();
    sessions.unshift(saved);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

    return saved;
  }

  async getSessions(): Promise<SavedSession[]> {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];

    try {
      const parsed: SavedSession[] = JSON.parse(raw);
      const sessions = Array.isArray(parsed) ? parsed : [];
      return sessions.sort(
        (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
      );
    } catch {
      return [];
    }
  }

  async getSessionById(id: string): Promise<SavedSession | null> {
    const sessions = await this.getSessions();
    return sessions.find((s) => s.id === id) ?? null;
  }

  async deleteSession(id: string): Promise<void> {
    const sessions = await this.getSessions();
    const filtered = sessions.filter((s) => s.id !== id);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
  }
}
