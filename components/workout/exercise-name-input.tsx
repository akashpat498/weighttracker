import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import type { Exercise } from '@/types/exercise';

interface ExerciseNameInputProps {
  value: string;
  catalog: Exercise[];
  onChangeText: (value: string) => void;
  /** Fired when a suggestion is tapped or the field is confirmed with a known name. */
  onSelect: (name: string) => void;
}

/** Exercise-name field with an autocomplete dropdown sourced from the catalog. */
export function ExerciseNameInput({
  value,
  catalog,
  onChangeText,
  onSelect,
}: ExerciseNameInputProps) {
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return catalog
      .filter(
        (e) => e.name.toLowerCase().includes(query) && e.name.toLowerCase() !== query
      )
      .slice(0, 5);
  }, [value, catalog]);

  const showSuggestions = focused && suggestions.length > 0;

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Exercise name"
        placeholderTextColor={Colors.muted}
        autoCapitalize="words"
        style={{
          color: Colors.text,
          fontFamily: 'IBMPlexMono_600SemiBold',
          fontSize: 17,
          paddingVertical: 4,
        }}
      />
      {showSuggestions && (
        <View
          className="mt-1 overflow-hidden rounded-lg"
          style={{ backgroundColor: Colors.chip }}>
          {suggestions.map((exercise) => (
            <Pressable
              key={exercise.id}
              // onPress fires before blur via onPressIn timing; use onPressIn to beat blur.
              onPressIn={() => {
                onChangeText(exercise.name);
                onSelect(exercise.name);
              }}
              className="px-3 py-2">
              <ThemedText style={{ fontSize: 15 }}>{exercise.name}</ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
