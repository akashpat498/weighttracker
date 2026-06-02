import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useSettings } from '@/contexts/settings-context';
import { analyticsService } from '@/services/analytics';
import { sessionRepository, splitRepository } from '@/services/storage';
import type { SavedSession } from '@/types/session';
import { formatLongDate } from '@/utils/format-date';
import { formatWeight } from '@/utils/units';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { unit } = useSettings();
  const [session, setSession] = useState<SavedSession | null>(null);
  const [splitName, setSplitName] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      sessionRepository.getSessionById(id).then(async (s) => {
        if (!active) return;
        setSession(s);
        if (s?.splitId) {
          const split = await splitRepository.getSplitById(s.splitId);
          if (active) setSplitName(split?.name);
        }
        setLoaded(true);
      });
      return () => {
        active = false;
      };
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert('Delete workout?', 'This permanently removes this session.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await sessionRepository.deleteSession(id);
          analyticsService.sessionDeleted();
          router.back();
        },
      },
    ]);
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-4 py-2">
          <Pressable onPress={() => router.back()} hitSlop={8} className="p-1">
            <IconSymbol name="chevron.left" size={26} color={Colors.text} />
          </Pressable>
          <Pressable onPress={handleDelete} hitSlop={8} className="p-1">
            <IconSymbol name="trash" size={22} color={Colors.muted} />
          </Pressable>
        </View>

        {loaded && !session ? (
          <View className="flex-1 items-center justify-center px-10">
            <ThemedText style={{ color: Colors.muted }}>This workout no longer exists.</ThemedText>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: 40 }}>
            {session && (
              <>
                <ThemedText type="title" style={{ fontSize: 24 }}>
                  {formatLongDate(session.performedAt)}
                </ThemedText>
                {splitName ? (
                  <ThemedText className="mt-1" style={{ color: Colors.tint }}>
                    {splitName}
                  </ThemedText>
                ) : null}

                {session.entries.map((entry) => (
                  <View
                    key={entry.id}
                    className="mt-4 rounded-2xl p-4"
                    style={{
                      backgroundColor: Colors.surface,
                      borderWidth: 1,
                      borderColor: Colors.border,
                    }}>
                    <ThemedText type="subtitle" style={{ fontSize: 18 }}>
                      {entry.exerciseName}
                    </ThemedText>
                    <View className="mt-2">
                      {entry.sets.map((set, index) => (
                        <View key={set.id} className="flex-row items-center py-1">
                          <ThemedText style={{ color: Colors.muted, width: 28 }}>
                            {index + 1}
                          </ThemedText>
                          <ThemedText type="defaultSemiBold">
                            {formatWeight(set.weightKg, unit)} × {set.reps}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                    {entry.notes ? (
                      <ThemedText
                        className="mt-2"
                        style={{ color: Colors.muted, fontSize: 13 }}>
                        {entry.notes}
                      </ThemedText>
                    ) : null}
                  </View>
                ))}

                {session.notes ? (
                  <View className="mt-4">
                    <ThemedText type="defaultSemiBold" style={{ color: Colors.muted }}>
                      Notes
                    </ThemedText>
                    <ThemedText className="mt-1">{session.notes}</ThemedText>
                  </View>
                ) : null}
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
