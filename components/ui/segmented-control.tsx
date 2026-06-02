import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Minimal pill segmented control used for the unit toggle and chart-metric toggle. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View
      className="flex-row rounded-xl p-1"
      style={{ backgroundColor: Colors.chip }}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className="flex-1 items-center justify-center rounded-lg py-2"
            style={selected ? { backgroundColor: Colors.surface } : undefined}>
            <ThemedText
              type="defaultSemiBold"
              style={{ color: selected ? Colors.text : Colors.muted, fontSize: 14 }}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
