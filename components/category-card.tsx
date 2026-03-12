import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface CategoryCardProps {
  id: string;
  label: string;
  color: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
}

export function CategoryCard({ id, label, color, image, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="items-center w-[80px] mr-4"
    >
      <View
        className="w-[72px] h-[72px] rounded-2xl items-center justify-center mb-2 overflow-hidden"
        style={image ? undefined : { backgroundColor: color }}
      >
        {image ? (
          <Image
            source={image}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-white text-2xl font-bold">
            {label.charAt(0)}
          </Text>
        )}
        <View
          className="absolute inset-0 rounded-2xl bg-black/35"
          pointerEvents="none"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)', '#000']}
          locations={[0.3, 0.7, 1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -2,
            height: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
          pointerEvents="none"
        />
      </View>
      <Text className="text-white text-sm font-medium text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
