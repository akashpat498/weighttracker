import { Tabs } from 'expo-router';
import React from 'react';

import { CenterTabButton } from '@/components/layout/center-tab-button';
import { HapticTab } from '@/components/layout/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
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
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          headerShown: false,
          tabBarButton: CenterTabButton,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="list.bullet.rectangle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
