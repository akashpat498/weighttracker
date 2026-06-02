import { useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExerciseProgressRow } from '@/components/progress/exercise-progress-row';
import { EmptyState } from '@/components/ui/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useSettings } from '@/contexts/settings-context';
import { useSessions } from '@/hooks/use-sessions';
import { exerciseTrend } from '@/utils/overload';

interface ProgressItem {
  id: string;
  name: string;
}

export default function ProgressScreen() {
  const router = useRouter();
  const { unit } = useSettings();
  const { sessions, loading, refresh } = useSessions();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Exercises with at least one logged session, most-recently-trained first.
  const items: ProgressItem[] = [];
  const seen = new Set<string>();
  for (const session of sessions) {
    for (const entry of session.entries) {
      if (!seen.has(entry.exerciseId)) {
        seen.add(entry.exerciseId);
        items.push({ id: entry.exerciseId, name: entry.exerciseName });
      }
    }
  }

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-start justify-between px-5 pb-1">
          <View className="flex-1">
            <ThemedText type="title">Progress</ThemedText>
            <ThemedText style={{ color: Colors.muted, marginTop: 2, fontSize: 14 }}>
              Tap an exercise to track progressive overload.
            </ThemedText>
          </View>
          <Pressable onPress={() => router.push('/settings')} hitSlop={8} className="ml-3 pt-1">
            <IconSymbol name="gearshape.fill" size={24} color={Colors.muted} />
          </Pressable>
        </View>

        {!loading && items.length === 0 ? (
          <EmptyState
            icon="chart.bar.fill"
            title="No progress yet"
            message="Log a few workouts and your exercises will appear here with their trends."
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
            renderItem={({ item }) => (
              <ExerciseProgressRow
                name={item.name}
                trend={exerciseTrend(sessions, item.id)}
                unit={unit}
                onPress={() => router.push(`/(tabs)/progress/exercise/${item.id}`)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
