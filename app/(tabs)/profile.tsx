import React from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Storage cleared', 'All local data has been removed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear storage.');
      console.warn('Failed to clear AsyncStorage:', error);
    }
  };

  return (
    <View className="flex-1 bg-black items-center justify-center gap-4">
      <Text className="text-white text-xl">Profile</Text>
      <TouchableOpacity
        onPress={() => router.push('/onboarding')}
        activeOpacity={0.8}
        className="bg-step-700 py-2.5 px-5 rounded-full border border-step-600"
      >
        <Text className="text-white font-medium">View onboarding</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleClearStorage}
        activeOpacity={0.8}
        className="bg-red-700 py-2.5 px-5 rounded-full border border-red-500"
      >
        <Text className="text-white font-medium">Wipe local storage</Text>
      </TouchableOpacity>
    </View>
  );
}
