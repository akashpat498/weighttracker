import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { usePathname } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export function CenterTabButton(props: BottomTabBarButtonProps) {
  const { onPress, style } = props;
  const pathname = usePathname();
  const isSelected = pathname.startsWith('/log');

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      impactAsync(ImpactFeedbackStyle.Light);
    }
    const event = {
      defaultPrevented: false,
      preventDefault: () => {},
    } as Parameters<NonNullable<BottomTabBarButtonProps['onPress']>>[0];
    onPress?.(event);
  };

  return (
    <View
      style={[
        style,
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -20,
        },
      ]}>
      <Pressable
        onPress={handlePress}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: Colors.tint,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <IconSymbol name="plus" size={28} color={isSelected ? Colors.previewBg : '#fff'} />
      </Pressable>
    </View>
  );
}
