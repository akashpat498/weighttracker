import { useCallback, useEffect, useReducer, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useSettings } from '@/contexts/settings-context';
import { sessionRepository } from '@/services/storage';
import type { SavedSession } from '@/types/session';
import type { Split } from '@/types/split';
import type { Unit } from '@/types/units';
import { getLastEntryForExercise } from '@/utils/overload';
import { kgToDisplay } from '@/utils/units';

/** A set as typed in the Log form. `weight`/`reps` are display strings. */
export interface DraftSet {
  id: string;
  weight: string;
  reps: string;
  bodyweight: boolean;
}

export interface DraftEntry {
  id: string;
  exerciseName: string;
  sets: DraftSet[];
  notes: string;
}

export interface DraftState {
  splitId?: string;
  /** Name for a new split to save, or the selected split's name. Empty = ad-hoc session. */
  splitName: string;
  notes: string;
  entries: DraftEntry[];
}

function emptySet(): DraftSet {
  return { id: uuidv4(), weight: '', reps: '', bodyweight: false };
}

function newEntry(name = ''): DraftEntry {
  return { id: uuidv4(), exerciseName: name, sets: [emptySet()], notes: '' };
}

/** Build draft sets from a previously-saved entry, converting kg → current unit. */
function setsFromLast(
  last: ReturnType<typeof getLastEntryForExercise>,
  unit: Unit
): DraftSet[] {
  if (!last || last.sets.length === 0) return [emptySet()];
  return last.sets.map((s) => ({
    id: uuidv4(),
    weight: s.weightKg === null ? '' : String(kgToDisplay(s.weightKg, unit)),
    reps: String(s.reps),
    bodyweight: s.weightKg === null,
  }));
}

const initialState: DraftState = {
  splitId: undefined,
  splitName: '',
  notes: '',
  entries: [],
};

type Action =
  | { type: 'ADD_ENTRY'; entry: DraftEntry }
  | { type: 'REMOVE_ENTRY'; entryId: string }
  | { type: 'SET_ENTRY_NAME'; entryId: string; name: string }
  | { type: 'SET_ENTRY_SETS'; entryId: string; sets: DraftSet[] }
  | { type: 'ADD_SET'; entryId: string }
  | { type: 'REMOVE_SET'; entryId: string; setId: string }
  | { type: 'SET_SET_FIELD'; entryId: string; setId: string; field: 'weight' | 'reps'; value: string }
  | { type: 'TOGGLE_BODYWEIGHT'; entryId: string; setId: string }
  | { type: 'SET_ENTRY_NOTES'; entryId: string; notes: string }
  | { type: 'SET_SESSION_NOTES'; notes: string }
  | { type: 'SET_SPLIT_NAME'; name: string }
  | { type: 'LOAD_SPLIT'; splitId: string; splitName: string; entries: DraftEntry[] }
  | { type: 'RESET' };

function mapEntry(state: DraftState, entryId: string, fn: (e: DraftEntry) => DraftEntry): DraftState {
  return { ...state, entries: state.entries.map((e) => (e.id === entryId ? fn(e) : e)) };
}

function reducer(state: DraftState, action: Action): DraftState {
  switch (action.type) {
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.entry] };
    case 'REMOVE_ENTRY':
      return { ...state, entries: state.entries.filter((e) => e.id !== action.entryId) };
    case 'SET_ENTRY_NAME':
      return mapEntry(state, action.entryId, (e) => ({ ...e, exerciseName: action.name }));
    case 'SET_ENTRY_SETS':
      return mapEntry(state, action.entryId, (e) => ({ ...e, sets: action.sets }));
    case 'ADD_SET':
      return mapEntry(state, action.entryId, (e) => {
        const last = e.sets[e.sets.length - 1];
        const prefilled: DraftSet = last
          ? { id: uuidv4(), weight: last.weight, reps: last.reps, bodyweight: last.bodyweight }
          : emptySet();
        return { ...e, sets: [...e.sets, prefilled] };
      });
    case 'REMOVE_SET':
      return mapEntry(state, action.entryId, (e) => ({
        ...e,
        sets: e.sets.length > 1 ? e.sets.filter((s) => s.id !== action.setId) : e.sets,
      }));
    case 'SET_SET_FIELD':
      return mapEntry(state, action.entryId, (e) => ({
        ...e,
        sets: e.sets.map((s) =>
          s.id === action.setId ? { ...s, [action.field]: action.value } : s
        ),
      }));
    case 'TOGGLE_BODYWEIGHT':
      return mapEntry(state, action.entryId, (e) => ({
        ...e,
        sets: e.sets.map((s) =>
          s.id === action.setId
            ? { ...s, bodyweight: !s.bodyweight, weight: !s.bodyweight ? '' : s.weight }
            : s
        ),
      }));
    case 'SET_ENTRY_NOTES':
      return mapEntry(state, action.entryId, (e) => ({ ...e, notes: action.notes }));
    case 'SET_SESSION_NOTES':
      return { ...state, notes: action.notes };
    case 'SET_SPLIT_NAME':
      return { ...state, splitName: action.name };
    case 'LOAD_SPLIT':
      return {
        ...state,
        splitId: action.splitId,
        splitName: action.splitName,
        entries: action.entries,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useSessionDraft() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { unit } = useSettings();
  const sessionsRef = useRef<SavedSession[]>([]);

  // Keep a current snapshot of saved sessions for prefill lookups.
  useEffect(() => {
    let active = true;
    sessionRepository.getSessions().then((s) => {
      if (active) sessionsRef.current = s;
    });
    return () => {
      active = false;
    };
  }, []);

  const addExercise = useCallback(
    (name = '') => {
      const trimmed = name.trim();
      const last = trimmed ? getLastEntryForExercise(sessionsRef.current, trimmed) : null;
      const entry = newEntry(trimmed);
      if (last) entry.sets = setsFromLast(last, unit);
      dispatch({ type: 'ADD_ENTRY', entry });
    },
    [unit]
  );

  /** Called when a name is confirmed (e.g. autocomplete pick) to prefill from history. */
  const prefillFromName = useCallback(
    (entryId: string, name: string) => {
      const last = getLastEntryForExercise(sessionsRef.current, name);
      if (last) dispatch({ type: 'SET_ENTRY_SETS', entryId, sets: setsFromLast(last, unit) });
    },
    [unit]
  );

  const loadSplit = useCallback(
    (split: Split) => {
      const entries: DraftEntry[] = split.exerciseNames.map((name) => {
        const last = getLastEntryForExercise(sessionsRef.current, name);
        const entry = newEntry(name);
        if (last) entry.sets = setsFromLast(last, unit);
        return entry;
      });
      dispatch({
        type: 'LOAD_SPLIT',
        splitId: split.id,
        splitName: split.name,
        entries: entries.length > 0 ? entries : [newEntry()],
      });
    },
    [unit]
  );

  return {
    state,
    addExercise,
    prefillFromName,
    loadSplit,
    removeExercise: (entryId: string) => dispatch({ type: 'REMOVE_ENTRY', entryId }),
    setExerciseName: (entryId: string, name: string) =>
      dispatch({ type: 'SET_ENTRY_NAME', entryId, name }),
    addSet: (entryId: string) => dispatch({ type: 'ADD_SET', entryId }),
    removeSet: (entryId: string, setId: string) =>
      dispatch({ type: 'REMOVE_SET', entryId, setId }),
    setSetField: (entryId: string, setId: string, field: 'weight' | 'reps', value: string) =>
      dispatch({ type: 'SET_SET_FIELD', entryId, setId, field, value }),
    toggleBodyweight: (entryId: string, setId: string) =>
      dispatch({ type: 'TOGGLE_BODYWEIGHT', entryId, setId }),
    setEntryNotes: (entryId: string, notes: string) =>
      dispatch({ type: 'SET_ENTRY_NOTES', entryId, notes }),
    setSessionNotes: (notes: string) => dispatch({ type: 'SET_SESSION_NOTES', notes }),
    setSplitName: (name: string) => dispatch({ type: 'SET_SPLIT_NAME', name }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}
