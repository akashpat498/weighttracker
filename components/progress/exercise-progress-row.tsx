import { Pressable, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import type { Unit } from '@/types/units';
import type { ExerciseTrend } from '@/utils/overload';
import { kgToDisplay } from '@/utils/units';

interface ExerciseProgressRowProps {
  name: string;
  trend: ExerciseTrend;
  unit: Unit;
  onPress: () => void;
}

export function ExerciseProgressRow({ name, trend, unit, onPress }: ExerciseProgressRowProps) {
  const up = trend.direction === 'up';
  const down = trend.direction === 'down';
  const color = up ? Colors.tint : down ? '#DC2626' : Colors.muted;
  const delta = kgToDisplay(Math.abs(trend.deltaKg), unit);
  const label = trend.direction === 'flat' ? 'No change' : `${up ? '+' : '−'}${delta} ${unit}`;

  return (
    <Pressable
      onPress={onPress}
      className="mb-2 flex-row items-center justify-between rounded-2xl p-4"
      style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border }}>
      <ThemedText type="defaultSemiBold" className="flex-1 pr-2" numberOfLines={1}>
        {name}
      </ThemedText>
      <View className="flex-row items-center">
        <IconSymbol
          name={up ? 'chart.bar.fill' : down ? 'minus' : 'minus'}
          size={14}
          color={color}
        />
        <ThemedText style={{ color, marginLeft: 6, fontSize: 14 }}>{label}</ThemedText>
        <IconSymbol name="chevron.right" size={16} color={Colors.muted} />
      </View>
    </Pressable>
  );
}
