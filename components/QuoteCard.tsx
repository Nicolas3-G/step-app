import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const STEP_900 = '#0d0d0d';

export interface QuoteCardProps {
  quote: string;
  attribution?: string;
  imageSource: ImageSourcePropType;
  onPressDetails?: () => void;
}

export function QuoteCard({ quote, attribution, imageSource, onPressDetails }: QuoteCardProps) {
  const [liked, setLiked] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  const triggerLikeAnimation = () => {
    floatAnim.setValue(0);
    Animated.timing(floatAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const floatingHeartStyle = {
    opacity: floatAnim.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        translateY: floatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -24],
        }),
      },
    ],
  };

  return (
    <View className="flex-row items-stretch h-[140px] max-h-[140px] flex-shrink-0 pl-4 pr-0 bg-step-900 mx-4 mb-0 rounded-2xl overflow-hidden">
      <View className="flex-1 min-h-0 justify-center pr-2 relative">
        <Text
          className="text-white text-lg font-semibold leading-[22px] italic"
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {quote}
        </Text>
        {attribution != null && (
          <Text className="text-gray-500 text-[13px] mt-2">{attribution}</Text>
        )}
        <View className="absolute bottom-2 right-2 flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onPressDetails}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLiked((prev) => {
                const next = !prev;
                if (next) {
                  triggerLikeAnimation();
                }
                return next;
              });
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={18}
              color={liked ? '#EF4444' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', bottom: 8, right: 8 }, floatingHeartStyle]}
        >
          <Ionicons name="heart" size={16} color="#F97316" />
        </Animated.View>
      </View>
      <View className="w-[100px] self-stretch ml-4 overflow-hidden relative">
        <Image
          source={imageSource}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={[STEP_900, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}
