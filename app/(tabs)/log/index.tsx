import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { ExerciseEntryCard } from '@/components/workout/exercise-entry-card';
import { SplitPicker } from '@/components/workout/split-picker';
import { Colors } from '@/constants/theme';
import { useSettings } from '@/contexts/settings-context';
import { useExerciseCatalog } from '@/hooks/use-exercise-catalog';
import { useSessionDraft } from '@/hooks/use-session-draft';
import { analyticsService } from '@/services/analytics';
import { exerciseRepository, sessionRepository, splitRepository } from '@/services/storage';
import type { ExerciseEntry, SetEntry } from '@/types/session';
import type { Split } from '@/types/split';
import { displayToKg } from '@/utils/units';

export default function LogScreen() {
  const router = useRouter();
  const { unit } = useSettings();
  const { exercises, refresh: refreshCatalog } = useExerciseCatalog();
  const draft = useSessionDraft();
  const [splits, setSplits] = useState<Split[]>([]);
  const [saving, setSaving] = useState(false);

  const loadSplits = useCallback(() => {
    splitRepository.getSplits().then(setSplits);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSplits();
      refreshCatalog();
    }, [loadSplits, refreshCatalog])
  );

  const handleSelectSplit = (split: Split) => draft.loadSplit(split);

  const buildValidEntries = (): { entries: ExerciseEntry[]; names: string[] } | null => {
    const entries: ExerciseEntry[] = [];
    const names: string[] = [];

    for (const draftEntry of draft.state.entries) {
      const name = draftEntry.exerciseName.trim();
      if (!name) continue;

      const sets: SetEntry[] = [];
      for (const s of draftEntry.sets) {
        const reps = parseInt(s.reps, 10);
        if (!Number.isFinite(reps) || reps <= 0) continue;
        if (s.bodyweight) {
          sets.push({ id: uuidv4(), weightKg: null, reps });
        } else {
          const weight = parseFloat(s.weight);
          if (!Number.isFinite(weight) || weight < 0) continue;
          sets.push({ id: uuidv4(), weightKg: displayToKg(weight, unit), reps });
        }
      }
      if (sets.length === 0) continue;

      // exerciseId is filled in during the async save (upsertByName).
      entries.push({ id: uuidv4(), exerciseId: '', exerciseName: name, sets, notes: draftEntry.notes.trim() || undefined });
      names.push(name);
    }

    return entries.length > 0 ? { entries, names } : null;
  };

  const resolveSplitId = async (names: string[]): Promise<string | undefined> => {
    if (draft.state.splitId) return draft.state.splitId;
    const splitName = draft.state.splitName.trim();
    if (!splitName) return undefined;

    const existing = splits.find((s) => s.name.toLowerCase() === splitName.toLowerCase());
    if (existing) return existing.id;

    const created = await splitRepository.saveSplit({ name: splitName, exerciseNames: names });
    return created.id;
  };

  const handleSave = async () => {
    const built = buildValidEntries();
    if (!built) {
      Alert.alert('Nothing to save', 'Add at least one exercise with a set (reps required).');
      return;
    }

    setSaving(true);
    try {
      // Upsert exercises to resolve catalog ids.
      const entries: ExerciseEntry[] = [];
      for (const entry of built.entries) {
        const exercise = await exerciseRepository.upsertByName(entry.exerciseName);
        entries.push({ ...entry, exerciseId: exercise.id, exerciseName: exercise.name });
      }

      const splitId = await resolveSplitId(built.names);
      const setCount = entries.reduce((n, e) => n + e.sets.length, 0);

      await sessionRepository.saveSession({
        splitId,
        performedAt: new Date().toISOString(),
        notes: draft.state.notes.trim() || undefined,
        entries,
      });

      analyticsService.sessionLogged({
        exercise_count: entries.length,
        set_count: setCount,
        from_split: Boolean(splitId),
      });

      draft.reset();
      router.navigate('/(tabs)/history');
    } catch {
      Alert.alert('Could not save', 'Something went wrong saving your workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const hasEntries = draft.state.entries.length > 0;

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 pb-2">
          <ThemedText type="title">Log workout</ThemedText>
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="rounded-full px-5 py-2"
            style={{ backgroundColor: Colors.tint, opacity: saving ? 0.5 : 1 }}>
            <ThemedText type="onTint">{saving ? 'Saving…' : 'Save'}</ThemedText>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            className="flex-1 px-5"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 48 }}>
            <View className="mb-4 mt-1">
              <SplitPicker
                splits={splits}
                selectedSplitId={draft.state.splitId}
                splitName={draft.state.splitName}
                onSelectSplit={handleSelectSplit}
                onChangeName={draft.setSplitName}
              />
            </View>

            {draft.state.entries.map((entry) => (
              <ExerciseEntryCard
                key={entry.id}
                entry={entry}
                catalog={exercises}
                unit={unit}
                draft={draft}
              />
            ))}

            <Pressable
              onPress={() => draft.addExercise()}
              className="mt-1 flex-row items-center justify-center rounded-2xl py-4"
              style={{ borderWidth: 1.5, borderColor: Colors.tint, borderStyle: 'dashed' }}>
              <IconSymbol name="plus" size={20} color={Colors.tint} />
              <ThemedText type="defaultSemiBold" style={{ color: Colors.tint, marginLeft: 6 }}>
                Add exercise
              </ThemedText>
            </Pressable>

            {!hasEntries && (
              <ThemedText
                type="default"
                className="mt-6 text-center"
                style={{ color: Colors.muted }}>
                Pick a split or add an exercise to start logging.
              </ThemedText>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
