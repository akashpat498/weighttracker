import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { SessionCard } from '@/components/workout/session-card';
import { Colors } from '@/constants/theme';
import { useSessions } from '@/hooks/use-sessions';
import { splitRepository } from '@/services/storage';

export default function HistoryScreen() {
  const router = useRouter();
  const { sessions, loading, refresh } = useSessions();
  const [splitNames, setSplitNames] = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      refresh();
      splitRepository.getSplits().then((splits) => {
        setSplitNames(Object.fromEntries(splits.map((s) => [s.id, s.name])));
      });
    }, [refresh])
  );

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 pb-2">
          <ThemedText type="title">History</ThemedText>
          <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
            <IconSymbol name="gearshape.fill" size={24} color={Colors.muted} />
          </Pressable>
        </View>

        {!loading && sessions.length === 0 ? (
          <EmptyState
            icon="dumbbell.fill"
            title="No workouts yet"
            message="Tap the + button to log your first workout. It'll show up here."
          />
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, paddingTop: 4 }}
            renderItem={({ item }) => (
              <SessionCard
                session={item}
                splitName={item.splitId ? splitNames[item.splitId] : undefined}
                onPress={() => router.push(`/(tabs)/history/session/${item.id}`)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
