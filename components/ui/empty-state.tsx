import { View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors } from '@/constants/theme';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  title: string;
  message: string;
}

/** Centered icon + title + message used by empty list/chart screens. */
export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <IconSymbol name={icon} size={48} color={Colors.muted} />
      <ThemedText type="subtitle" className="mt-4 text-center">
        {title}
      </ThemedText>
      <ThemedText
        type="default"
        className="mt-2 text-center"
        style={{ color: Colors.muted }}>
        {message}
      </ThemedText>
    </View>
  );
}
