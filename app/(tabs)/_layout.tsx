import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CenterTabButton } from '@/components/layout/center-tab-button';
import { HapticTab } from '@/components/layout/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: { backgroundColor: Colors.previewBg, borderTopColor: Colors.previewBg },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        tabBarButton: HapticTab,
        sceneStyle: { paddingTop: insets.top },
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="list.bullet.rectangle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          headerShown: false,
          tabBarButton: CenterTabButton,
          sceneStyle: { paddingTop: 0 },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
