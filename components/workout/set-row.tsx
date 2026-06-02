import { Pressable, TextInput, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import type { DraftSet } from '@/hooks/use-session-draft';
import type { Unit } from '@/types/units';

interface SetRowProps {
  index: number;
  set: DraftSet;
  unit: Unit;
  canRemove: boolean;
  onChangeWeight: (value: string) => void;
  onChangeReps: (value: string) => void;
  onToggleBodyweight: () => void;
  onRemove: () => void;
}

const inputStyle = {
  backgroundColor: Colors.chip,
  color: Colors.text,
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 8,
  fontFamily: 'IBMPlexMono_500Medium',
  fontSize: 16,
} as const;

export function SetRow({
  index,
  set,
  unit,
  canRemove,
  onChangeWeight,
  onChangeReps,
  onToggleBodyweight,
  onRemove,
}: SetRowProps) {
  return (
    <View className="mb-2 flex-row items-center">
      <ThemedText
        type="defaultSemiBold"
        style={{ color: Colors.muted, width: 28 }}>
        {index + 1}
      </ThemedText>

      {/* Weight */}
      <View className="flex-1">
        {set.bodyweight ? (
          <View
            className="items-center justify-center"
            style={{ ...inputStyle, paddingVertical: 9 }}>
            <ThemedText style={{ color: Colors.muted }}>Body</ThemedText>
          </View>
        ) : (
          <TextInput
            value={set.weight}
            onChangeText={onChangeWeight}
            keyboardType="decimal-pad"
            placeholder={unit}
            placeholderTextColor={Colors.muted}
            style={inputStyle}
            returnKeyType="done"
          />
        )}
      </View>

      <ThemedText style={{ color: Colors.muted, paddingHorizontal: 10 }}>×</ThemedText>

      {/* Reps */}
      <View style={{ width: 72 }}>
        <TextInput
          value={set.reps}
          onChangeText={onChangeReps}
          keyboardType="number-pad"
          placeholder="reps"
          placeholderTextColor={Colors.muted}
          style={inputStyle}
          returnKeyType="done"
        />
      </View>

      {/* Bodyweight toggle */}
      <Pressable onPress={onToggleBodyweight} hitSlop={8} className="px-2">
        <IconSymbol
          name="figure.run"
          size={22}
          color={set.bodyweight ? Colors.tint : Colors.muted}
        />
      </Pressable>

      {/* Remove */}
      <Pressable
        onPress={onRemove}
        disabled={!canRemove}
        hitSlop={8}
        className="pl-1"
        style={{ opacity: canRemove ? 1 : 0.25 }}>
        <IconSymbol name="xmark.circle.fill" size={22} color={Colors.muted} />
      </Pressable>
    </View>
  );
}
