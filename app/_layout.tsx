import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Text, View } from 'react-native';
import React from 'react';
import '../global.css';

const StepTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ffffff',
    background: '#000000',
    card: '#000000',
    text: '#ffffff',
    border: '#333333',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={StepTheme}>
      <View className="flex-1 bg-black">
        <Stack
          initialRouteName="onboarding"
          screenOptions={{
            headerStyle: { backgroundColor: '#000000' },
            headerShadowVisible: false,
            headerTintColor: '#ffffff',
            headerLeft: () => (
              <Text className="text-white text-2xl font-bold ml-1">
                Step
              </Text>
            ),
          }}
        >
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ title: '' }} />
          <Stack.Screen
            name="add-quote"
            options={{
              title: 'Add quote',
              presentation: 'modal',
            }}
          />
        </Stack>
      </View>
      <StatusBar style="light" backgroundColor="#000000" />
    </ThemeProvider>
  );
}
