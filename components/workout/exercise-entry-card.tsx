import { Pressable, TextInput, View } from 'react-native';

import { ExerciseNameInput } from '@/components/workout/exercise-name-input';
import { SetRow } from '@/components/workout/set-row';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import type { DraftEntry, useSessionDraft } from '@/hooks/use-session-draft';
import type { Exercise } from '@/types/exercise';
import type { Unit } from '@/types/units';

interface ExerciseEntryCardProps {
  entry: DraftEntry;
  catalog: Exercise[];
  unit: Unit;
  draft: ReturnType<typeof useSessionDraft>;
}

export function ExerciseEntryCard({ entry, catalog, unit, draft }: ExerciseEntryCardProps) {
  return (
    <View
      className="mb-3 rounded-2xl p-4"
      style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <ExerciseNameInput
            value={entry.exerciseName}
            catalog={catalog}
            onChangeText={(name) => draft.setExerciseName(entry.id, name)}
            onSelect={(name) => draft.prefillFromName(entry.id, name)}
          />
        </View>
        <Pressable onPress={() => draft.removeExercise(entry.id)} hitSlop={8} className="pt-1">
          <IconSymbol name="trash" size={20} color={Colors.muted} />
        </Pressable>
      </View>

      <View className="mt-3">
        {entry.sets.map((set, index) => (
          <SetRow
            key={set.id}
            index={index}
            set={set}
            unit={unit}
            canRemove={entry.sets.length > 1}
            onChangeWeight={(v) => draft.setSetField(entry.id, set.id, 'weight', v)}
            onChangeReps={(v) => draft.setSetField(entry.id, set.id, 'reps', v)}
            onToggleBodyweight={() => draft.toggleBodyweight(entry.id, set.id)}
            onRemove={() => draft.removeSet(entry.id, set.id)}
          />
        ))}
      </View>

      <Pressable
        onPress={() => draft.addSet(entry.id)}
        className="mt-1 flex-row items-center self-start">
        <IconSymbol name="plus.circle.fill" size={20} color={Colors.tint} />
        <ThemedText type="defaultSemiBold" style={{ color: Colors.tint, marginLeft: 6 }}>
          Add set
        </ThemedText>
      </Pressable>

      <TextInput
        value={entry.notes}
        onChangeText={(v) => draft.setEntryNotes(entry.id, v)}
        placeholder="Notes (optional)"
        placeholderTextColor={Colors.muted}
        style={{
          marginTop: 10,
          color: Colors.text,
          fontFamily: 'IBMPlexMono_400Regular',
          fontSize: 14,
        }}
      />
    </View>
  );
}
