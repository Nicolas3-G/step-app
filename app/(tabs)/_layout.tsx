import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/custom-tab-bar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="blog" options={{ title: 'Quotes' }} />
      <Tabs.Screen name="activity" options={{ title: 'Add' }} />
      <Tabs.Screen name="feed" options={{ title: 'Journal' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
