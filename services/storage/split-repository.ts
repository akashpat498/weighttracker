import type { Split } from '@/types/split';

export interface SplitInput {
  name: string;
  exerciseNames: string[];
}

/**
 * Repository interface for workout-split templates. Splits are created on the fly
 * while logging and reused to pre-fill future sessions.
 */
export interface SplitRepository {
  saveSplit(split: SplitInput): Promise<Split>;
  getSplits(): Promise<Split[]>;
  getSplitById(id: string): Promise<Split | null>;
  deleteSplit(id: string): Promise<void>;
}
