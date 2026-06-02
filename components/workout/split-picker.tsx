import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import type { Split } from '@/types/split';

interface SplitPickerProps {
  splits: Split[];
  /** Currently selected split id, if a saved split was chosen. */
  selectedSplitId?: string;
  /** Current split name (free text for a new split, or the selected one's name). */
  splitName: string;
  onSelectSplit: (split: Split) => void;
  onChangeName: (name: string) => void;
}

/** Horizontal chips of saved splits plus a free-text field to name a new split. */
export function SplitPicker({
  splits,
  selectedSplitId,
  splitName,
  onSelectSplit,
  onChangeName,
}: SplitPickerProps) {
  return (
    <View>
      <ThemedText type="defaultSemiBold" style={{ color: Colors.muted, marginBottom: 8 }}>
        Split
      </ThemedText>

      {splits.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
          contentContainerStyle={{ gap: 8 }}>
          {splits.map((split) => {
            const selected = split.id === selectedSplitId;
            return (
              <Pressable
                key={split.id}
                onPress={() => onSelectSplit(split)}
                className="rounded-full px-4 py-2"
                style={{ backgroundColor: selected ? Colors.chipSelected : Colors.chip }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{ color: selected ? Colors.tintContrast : Colors.text, fontSize: 14 }}>
                  {split.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <TextInput
        value={splitName}
        onChangeText={onChangeName}
        placeholder="Name this split (e.g. Push) — optional"
        placeholderTextColor={Colors.muted}
        autoCapitalize="words"
        style={{
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: Colors.text,
          fontFamily: 'IBMPlexMono_500Medium',
          fontSize: 16,
        }}
      />
    </View>
  );
}
