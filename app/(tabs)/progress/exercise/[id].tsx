import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OverloadChart, type ChartPoint } from '@/components/progress/overload-chart';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useSettings } from '@/contexts/settings-context';
import { analyticsService } from '@/services/analytics';
import { exerciseRepository, sessionRepository } from '@/services/storage';
import type { SavedSession } from '@/types/session';
import type { Unit } from '@/types/units';
import { buildExerciseProgress, type ProgressPoint } from '@/utils/overload';
import { formatShortDate } from '@/utils/format-date';
import { kgToDisplay } from '@/utils/units';

type Metric = 'est1RM' | 'topSet' | 'volume';

const METRIC_OPTIONS: { label: string; value: Metric }[] = [
  { label: 'Est 1RM', value: 'est1RM' },
  { label: 'Top set', value: 'topSet' },
  { label: 'Volume', value: 'volume' },
];

function axisDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
}

function metricValueKg(point: ProgressPoint, metric: Metric): number | null {
  if (metric === 'est1RM') return point.est1RMKg;
  if (metric === 'topSet') return point.topSetKg;
  return point.volumeKg;
}

export default function ExerciseProgressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { unit } = useSettings();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [name, setName] = useState('');
  const [metric, setMetric] = useState<Metric>('est1RM');

  useEffect(() => {
    sessionRepository.getSessions().then(setSessions);
    exerciseRepository.getExerciseById(id).then((e) => setName(e?.name ?? 'Exercise'));
  }, [id]);

  const points = useMemo(() => buildExerciseProgress(sessions, id), [sessions, id]);

  useEffect(() => {
    if (points.length > 0) {
      analyticsService.exerciseProgressViewed({ data_points: points.length });
    }
  }, [points.length]);

  const chartData: ChartPoint[] = useMemo(() => {
    return points
      .map((p) => ({ kg: metricValueKg(p, metric), date: p.date }))
      .filter((p): p is { kg: number; date: string } => p.kg !== null)
      .map((p) => ({ value: kgToDisplay(p.kg, unit), label: axisDate(p.date) }));
  }, [points, metric, unit]);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center px-4 py-2">
          <Pressable onPress={() => router.back()} hitSlop={8} className="p-1">
            <IconSymbol name="chevron.left" size={26} color={Colors.text} />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
          <ThemedText type="title" style={{ fontSize: 26 }}>
            {name}
          </ThemedText>

          <View className="mt-4">
            <SegmentedControl options={METRIC_OPTIONS} value={metric} onChange={setMetric} />
          </View>

          {chartData.length >= 2 ? (
            <View
              className="mt-4 rounded-2xl p-3"
              style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border }}>
              <OverloadChart data={chartData} yAxisSuffix={metric === 'volume' ? '' : ` ${unit}`} />
            </View>
          ) : (
            <View
              className="mt-4 items-center rounded-2xl px-6 py-10"
              style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border }}>
              <IconSymbol name="chart.bar.fill" size={36} color={Colors.muted} />
              <ThemedText className="mt-3 text-center" style={{ color: Colors.muted }}>
                Log this exercise at least twice with weight to chart a trend.
              </ThemedText>
            </View>
          )}

          <ThemedText type="defaultSemiBold" className="mb-2 mt-6" style={{ color: Colors.muted }}>
            Sessions
          </ThemedText>
          {[...points].reverse().map((p) => (
            <SessionRow key={p.date} point={p} unit={unit} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function SessionRow({ point, unit }: { point: ProgressPoint; unit: Unit }) {
  const topSet = point.topSetKg !== null ? `${kgToDisplay(point.topSetKg, unit)} ${unit}` : 'Body';
  return (
    <View
      className="mb-2 flex-row items-center justify-between rounded-xl px-4 py-3"
      style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border }}>
      <ThemedText style={{ fontSize: 14 }}>{formatShortDate(point.date)}</ThemedText>
      <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
        Top {topSet} · Vol {kgToDisplay(point.volumeKg, unit)}
      </ThemedText>
    </View>
  );
}
