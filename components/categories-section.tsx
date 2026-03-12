import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { CategoryCard } from './category-card';

export interface CategoryItem {
  id: string;
  label: string;
  color: string;
  image?: ImageSourcePropType;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'fitness', label: 'Fitness', color: '#C41E3A', image: require('../assets/images/fitness.jpg') },
  { id: 'anxiety', label: 'Anxiety', color: '#1a1a1a', image: require('../assets/images/anxiety.jpg') },
  { id: 'belief', label: 'Belief', color: '#4A3728', image: require('../assets/images/belief.jpg') },
  { id: 'mindfulness', label: 'Mindfulness', color: '#0D5C63', image: require('../assets/images/mindfullness.jpg') },
  { id: 'growth', label: 'Growth', color: '#2D5016', image: require('../assets/images/growth.jpg') },
  { id: 'habits', label: 'Habits', color: '#3D2C8C', image: require('../assets/images/habits.jpg') },
];

export interface CategoriesSectionProps {
  title?: string;
  onCategoryPress?: (id: string) => void;
}

export function CategoriesSection({
  title = 'Browse by category',
  onCategoryPress,
}: CategoriesSectionProps) {
  const categories = CATEGORIES;
  return (
    <View className="pb-6">
      <Text className="text-lg font-semibold text-white px-4 mb-4">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            {...category}
            onPress={onCategoryPress ? () => onCategoryPress(category.id) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}
