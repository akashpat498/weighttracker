import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

export default function LogScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1 px-5" edges={['top']}>
        <ThemedText type="title" className="mt-2">
          Log a workout
        </ThemedText>
        <ThemedText type="default" className="mt-3 text-app-muted">
          The workout entry form will live here once the MVP scope is defined.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
