import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { QuoteCard } from '../../components/QuoteCard';
import { WeeklyStreakCard } from '../../components/weekly-streak-card';
import { CategoriesSection } from '../../components/categories-section';
import { collection, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { signInAnonymouslyIfNeeded } from '../../auth';

const PILLS = ['quotes', 'authors', 'books', 'notes'] as const;

type QuoteDoc = {
  id: string;
  quoteText?: string;
  author?: string;
  source?: string;
  dateCreated?: Timestamp;
};

export default function HomeScreen() {
  const [quotes, setQuotes] = useState<QuoteDoc[]>([]);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const { width } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await signInAnonymouslyIfNeeded();

        const quotesRef = collection(db, 'quotes');
        const q = query(quotesRef, orderBy('dateCreated', 'desc'), limit(3));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docs = snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<QuoteDoc, 'id'>;
            return { id: doc.id, ...data };
          });
          setQuotes(docs);
        }
      } catch (error) {
        console.warn('Failed to initialize home screen:', error);
      }
    };

    init();
  }, []);

  const handleQuoteScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / layoutMeasurement.width);
    if (pageIndex !== activeQuoteIndex) {
      setActiveQuoteIndex(pageIndex);
    }
  };

  const fallbackQuote =
    '"The only way to do great work is to love what you do."';
  const fallbackAttribution = '— Placeholder';

  return (
    <View className="flex-1 bg-black">
      {/* Horizontal pill section under header */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 pt-3 pb-4"
        className="flex-grow-0"
      >
        {PILLS.map((label) => (
          <TouchableOpacity
            key={label}
            activeOpacity={0.7}
            className="px-[18px] py-2.5 rounded-full bg-step-800 border border-step-600 mr-2.5"
          >
            <Text className="text-white text-[15px] font-semibold">
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleQuoteScroll}
        scrollEventThrottle={16}
        className="flex-grow-0"
        contentContainerClassName="pb-2"
      >
        {(quotes.length > 0 ? quotes : [{ id: 'fallback' } as QuoteDoc]).map(
          (item, index) => {
            const text = item.quoteText ?? fallbackQuote;
            const attributionSource =
              item.author || item.source || fallbackAttribution;

            return (
              <View key={item.id ?? `fallback-${index}`} style={{ width }}>
                <QuoteCard
                  quote={text}
                  attribution={attributionSource}
                  imageSource={require('../../assets/images/quote-placeholder.jpg')}
                  onPressDetails={
                    item.id
                      ? () => router.push(`/quote/${item.id}`)
                      : undefined
                  }
                />
              </View>
            );
          }
        )}
      </ScrollView>

      <CategoriesSection />

      {/* Weekly streak / activity card */}
      <View className="px-0 pb-6">
        <WeeklyStreakCard
          streak={68}
          activeDays={[0, 1, 2, 3, 4]}
          date={new Date()}
        />
      </View>

      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-xl font-bold text-white">
          Step Home
        </Text>
        <Text className="mt-2 text-sm text-white">
          Placeholder homescreen text here
        </Text>
      </View>
    </View>
  );
}
