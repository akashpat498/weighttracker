import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SegmentedControl } from '@/components/ui/segmented-control';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors } from '@/constants/theme';
import { useSettings } from '@/contexts/settings-context';
import type { Unit } from '@/types/units';

const UNIT_OPTIONS: { label: string; value: Unit }[] = [
  { label: 'Pounds (lb)', value: 'lb' },
  { label: 'Kilograms (kg)', value: 'kg' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { unit, setUnit } = useSettings();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1 px-5" edges={['top']}>
        <View
          className="flex-row items-center justify-between"
          style={{ paddingTop: 24, paddingBottom: 8 }}>
          <ThemedText type="title">Settings</ThemedText>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ThemedText type="link">Done</ThemedText>
          </Pressable>
        </View>

        <View className="mt-4">
          <ThemedText type="defaultSemiBold" style={{ color: Colors.muted, marginBottom: 8 }}>
            Weight unit
          </ThemedText>
          <SegmentedControl options={UNIT_OPTIONS} value={unit} onChange={setUnit} />
          <ThemedText className="mt-2" style={{ color: Colors.muted, fontSize: 13 }}>
            Changing units re-displays all your history — your logged numbers stay exactly as
            recorded.
          </ThemedText>
        </View>

        <View
          className="mt-8 rounded-2xl p-4"
          style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border }}>
          <ThemedText type="defaultSemiBold">WeightTracker</ThemedText>
          <ThemedText className="mt-1" style={{ color: Colors.muted, fontSize: 13 }}>
            All data is stored locally on this device.
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
