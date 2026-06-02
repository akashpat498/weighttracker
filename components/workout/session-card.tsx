import { Pressable, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';
import type { SavedSession } from '@/types/session';
import { formatShortDate } from '@/utils/format-date';

interface SessionCardProps {
  session: SavedSession;
  splitName?: string;
  onPress: () => void;
}

export function SessionCard({ session, splitName, onPress }: SessionCardProps) {
  const setCount = session.entries.reduce((n, e) => n + e.sets.length, 0);
  const exerciseSummary = session.entries.map((e) => e.exerciseName).join(' · ');

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl p-4"
      style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border }}>
      <View className="flex-row items-center justify-between">
        <ThemedText type="defaultSemiBold">{formatShortDate(session.performedAt)}</ThemedText>
        {splitName ? (
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: Colors.chip }}>
            <ThemedText style={{ fontSize: 13, color: Colors.text }}>{splitName}</ThemedText>
          </View>
        ) : null}
      </View>

      <ThemedText className="mt-2" style={{ color: Colors.muted, fontSize: 14 }} numberOfLines={2}>
        {exerciseSummary || 'No exercises'}
      </ThemedText>

      <View className="mt-2 flex-row items-center">
        <IconSymbol name="dumbbell.fill" size={14} color={Colors.muted} />
        <ThemedText style={{ color: Colors.muted, fontSize: 13, marginLeft: 6 }}>
          {session.entries.length} exercise{session.entries.length === 1 ? '' : 's'} · {setCount} set
          {setCount === 1 ? '' : 's'}
        </ThemedText>
      </View>
    </Pressable>
  );
}
