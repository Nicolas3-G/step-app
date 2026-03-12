import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ACTIVE_RED = '#E53935';
const INACTIVE_WHITE = '#FFFFFF';

const TAB_CONFIG = [
  { name: 'index', label: 'Home', icon: 'home-outline' as const, iconFocused: 'home' as const },
  { name: 'blog', label: 'Quotes', icon: 'chatbubbles-outline' as const, iconFocused: 'chatbubbles' as const },
  { name: 'activity', label: 'Add', icon: 'add', isFAB: true },
  { name: 'feed', label: 'Journal', icon: 'book-outline' as const, iconFocused: 'book' as const },
  { name: 'profile', label: 'Profile', icon: 'person-outline' as const, iconFocused: 'person' as const },
];

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : 12;
  const router = useRouter();

  return (
    <View
      className="flex-row bg-[#1C1C1E] rounded-t-[20px] pt-3 items-center justify-around"
      style={{ paddingBottom: bottomInset }}
    >
      {TAB_CONFIG.map((tab, index) => {
        const route = state.routes.find((r) => r.name === tab.name);
        if (!route) return null;

        const isFocused = state.routes[state.index].key === route.key;
        const isFAB = tab.isFAB === true;

        if (isFAB) {
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                router.push('/add-quote');
              }}
              activeOpacity={0.8}
              className="items-center -mt-6"
            >
              <View className="w-14 h-14 rounded-full bg-[#E53935] items-center justify-center">
                <Ionicons name="add" size={28} color="#FFF" />
              </View>
              <Text className="text-white text-[10px] mt-1 font-medium">
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const iconName = isFocused && tab.iconFocused ? tab.iconFocused : tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            activeOpacity={0.7}
            className="items-center flex-1"
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? ACTIVE_RED : INACTIVE_WHITE}
            />
            <Text
              className={`text-[10px] mt-1 font-medium ${isFocused ? 'text-[#E53935]' : 'text-white'}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
