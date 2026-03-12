import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

// Monday = 0 in getDay() we use: Sun=0, Mon=1, ... So we need to map to Mo-Su order.
// Display order: Mo(1), Tu(2), We(3), Th(4), Fr(5), Sa(6), Su(0)
function getDayIndexForDisplay(dayIndex: number): number {
  // dayIndex: 0=Sun, 1=Mon, ..., 6=Sat
  // return 0=Mon, 1=Tue, ..., 6=Sun
  return dayIndex === 0 ? 6 : dayIndex - 1;
}

export interface WeeklyStreakCardProps {
  /** Current streak count */
  streak?: number;
  /** Which week days have activity (0=Mon, 1=Tue, ... 6=Sun) */
  activeDays?: number[];
  /** Optional date to show; defaults to today */
  date?: Date;
}

export function WeeklyStreakCard({
  streak = 0,
  activeDays = [],
  date = new Date(),
}: WeeklyStreakCardProps) {
  const todayDisplayIndex = getDayIndexForDisplay(date.getDay());
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isActive = (displayIndex: number) => activeDays.includes(displayIndex);
  const isToday = (displayIndex: number) => displayIndex === todayDisplayIndex;

  return (
    <View className="mx-4 rounded-2xl px-4 py-4 bg-step-900">
      {/* Header: date + streak pill */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-base font-bold">{formattedDate}</Text>
        <View className="flex-row items-center rounded-full px-3 py-1.5 bg-[#E53935]/25">
          <Text className="font-semibold text-base text-white">Streak: {streak}</Text>
          <View className="ml-1">
            <Ionicons name="flame" size={18} color="#EA580C" />
          </View>
        </View>
      </View>

      {/* Week row: 7 circles */}
      <View className="flex-row justify-between">
        {DAY_LABELS.map((label, displayIndex) => {
          const active = isActive(displayIndex);
          const today = isToday(displayIndex);
          const showFlame = active;

          return (
            <View key={label} className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  today ? 'bg-step-600' : active ? 'bg-step-700' : 'bg-transparent border-[1.5px] border-dashed border-step-500'
                }`}
              >
                {showFlame && (
                  <Ionicons name="flame" size={20} color="#EA580C" />
                )}
              </View>
              <Text className="text-[11px] text-gray-400 mt-2">{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
