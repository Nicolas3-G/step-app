import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const introVideo = require('../assets/intro.mp4');

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const player = useVideoPlayer(introVideo, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.container} className="bg-black">
      <VideoView
        player={player}
        style={[StyleSheet.absoluteFillObject, { width, height }]}
        contentFit="cover"
        nativeControls={false}
        {...(Platform.OS === 'android' && { surfaceType: 'textureView' })}
      />
      <View className="absolute inset-0 items-center justify-center pb-32">
        <Text className="text-white text-lg tracking-widest">Welcome To</Text>
        <Animated.View entering={FadeIn.delay(1000).duration(2500)}>
          <Text className="text-white text-5xl font-bold mt-1">Step</Text>
        </Animated.View>
      </View>
      <Animated.View
        entering={SlideInDown.delay(3500).duration(600)}
        className="absolute left-0 right-0 bottom-0 items-center"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <Text className="text-white text-center text-sm mb-4 px-6">
          Every journey begins with a
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.8}
          className="bg-white py-3.5 px-10 rounded-full"
        >
          <Text className="text-black text-base font-semibold">Step</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
