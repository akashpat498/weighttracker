import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';

export default function HistoryScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1 px-5" edges={['top']}>
        <ThemedText type="title" className="mt-2">
          History
        </ThemedText>
        <ThemedText type="default" className="mt-3 text-app-muted">
          Your logged workouts will appear here. Tap the + button to log your first one.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
