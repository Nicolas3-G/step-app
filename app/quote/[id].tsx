import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function QuoteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [quoteText, setQuoteText] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [activePromptColor, setActivePromptColor] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [reflections, setReflections] = useState<
    { id: string; prompt: string | null; text: string }[]
  >([]);
  const [editingReflectionId, setEditingReflectionId] = useState<string | null>(null);

  useEffect(() => {
    const loadQuote = async () => {
      if (!id) return;
      try {
        const ref = doc(db, 'quotes', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError('Quote not found');
          setLoading(false);
          return;
        }
        const data = snap.data() as {
          quoteText?: string;
          author?: string;
          source?: string;
          dateCreated?: Timestamp;
        };
        setQuoteText(data.quoteText ?? null);
        setAuthor(data.author || data.source || null);
        setLoading(false);
      } catch (e) {
        console.warn('Failed to load quote details:', e);
        setError('Something went wrong loading this quote.');
        setLoading(false);
      }
    };

    loadQuote();
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Quote',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={{ paddingHorizontal: 12, paddingVertical: 4 }}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-black">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pt-6 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Primary quote section */}
          <View className="bg-step-900 w-full px-5 py-6 mb-6">
            {loading ? (
              <View className="items-center justify-center py-4">
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : error ? (
              <Text className="text-red-400 text-sm text-center">
                {error}
              </Text>
            ) : (
              <>
                <Text className="text-white text-2xl font-semibold leading-[30px] italic">
                  {quoteText ?? 'Quote text unavailable.'}
                </Text>
              </>
            )}
          </View>

          {/* Author section */}
          {author && (
            <View className="flex-row items-center justify-between px-5 py-4 mb-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-step-700 items-center justify-center mr-3">
                  <Text className="text-white text-lg font-semibold">
                    {author.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text className="text-white text-base font-semibold">
                    {author}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    Author
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                className="border border-step-600 rounded-full px-4 py-1.5"
              >
                <Text className="text-white text-xs font-medium">
                  Author details
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quote details placeholder */}
          <View className="px-5 mt-2 mb-6">
            <Text className="text-white text-base font-semibold mb-2">
              Quote details
            </Text>
            <Text className="text-white text-sm leading-[22px] mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              lobortis, turpis non commodo fermentum, nisl erat pharetra ipsum,
              non pulvinar lectus nisl in lorem. Cras at vulputate nisi. Sed
              suscipit, nunc ac porta tincidunt, tellus lectus suscipit mi,
              vitae dictum justo neque id sapien.
            </Text>
            <Text className="text-gray-300 text-sm leading-[22px]">
              Donec euismod, urna sed luctus semper, tortor nibh aliquam
              justo, eget malesuada ligula mi sed mauris. In hac habitasse
              platea dictumst. Suspendisse potenti. Fusce consequat risus
              vitae laoreet placerat. Suspendisse tempor pretium sapien, vel
              interdum libero posuere eget.
            </Text>
          </View>

          {/* Reflections section */}
          <View className="px-5">
            <View className="flex-row items-center mb-2">
              <Text className="text-white text-base font-semibold mr-2">
                Your Reflections
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => {
                  setEditingReflectionId(null);
                  setActivePrompt(null);
                  setActivePromptColor(null);
                  setReflectionText('');
                  setShowReflectionModal(true);
                }}
              >
                <Ionicons name="add" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            {reflections.length === 0 ? (
              <View className="bg-step-900 rounded-2xl px-4 py-3">
                <Text className="text-gray-400 text-sm leading-[20px]">
                  Tap the plus button to add your thoughts.
                </Text>
              </View>
            ) : (
              <View className="mt-1">
                {reflections.map((reflection, index) => (
                  <View
                    key={reflection.id}
                    className="bg-step-900 rounded-2xl px-4 py-3 border border-step-700 mb-3"
                  >
                    {reflection.prompt && (
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-gray-400 text-xs">
                          {reflection.prompt}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setEditingReflectionId(reflection.id);
                            setActivePrompt(reflection.prompt);
                            setActivePromptColor(null);
                            setReflectionText(reflection.text);
                            setShowReflectionModal(true);
                          }}
                        >
                          <Text className="text-xs font-semibold text-red-400">
                            Edit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <Text className="text-white text-sm leading-[20px]">
                      {reflection.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Reflections bottom sheet modal */}
      <Modal
        visible={showReflectionModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          Keyboard.dismiss();
          setShowReflectionModal(false);
        }}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => {
            Keyboard.dismiss();
            setShowReflectionModal(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <Pressable
              style={{
                marginTop: 'auto',
                backgroundColor: '#0d0d0d',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                minHeight: '45%',
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 32,
              }}
            >
            <View className="items-center mb-4">
              <View className="w-10 h-1.5 rounded-full bg-step-700" />
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-base font-semibold">
                {activePrompt ? 'Write your reflection' : 'New reflection'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowReflectionModal(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={22} color="#E5E7EB" />
              </TouchableOpacity>
            </View>
            {activePrompt == null ? (
              <>
                <Text className="text-gray-400 text-sm mb-4">
                  Choose a prompt to guide your reflection.
                </Text>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-1 mr-2"
                    onPress={() =>
                      {
                        setActivePrompt('What does this mean to you?');
                        setActivePromptColor('#10B981'); // emerald-500
                      }
                    }
                  >
                    <View className="bg-step-900 rounded-2xl px-3 py-3 items-start">
                      <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center mb-2">
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
                      </View>
                      <Text className="text-white text-sm font-semibold">
                        What does this mean to you?
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-1 ml-2"
                    onPress={() =>
                      {
                        setActivePrompt('What does it make you think of?');
                        setActivePromptColor('#0EA5E9'); // sky-500
                      }
                    }
                  >
                    <View className="bg-step-900 rounded-2xl px-3 py-3 items-start">
                      <View className="w-8 h-8 rounded-full bg-sky-500 items-center justify-center mb-2">
                        <Ionicons name="bulb-outline" size={18} color="#FFFFFF" />
                      </View>
                      <Text className="text-white text-sm font-semibold">
                        What does it make you think of?
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View className="items-start mb-3">
                  <View
                    style={{
                      backgroundColor: activePromptColor
                        ? `${activePromptColor}40`
                        : '#37415166',
                      borderRadius: 999,
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                    }}
                  >
                    <Text className="text-white text-sm font-semibold">
                      {activePrompt}
                    </Text>
                  </View>
                </View>
                <View className="bg-step-900 rounded-2xl px-3 py-2 mb-4 border border-step-700">
                  <TextInput
                    value={reflectionText}
                    onChangeText={setReflectionText}
                    placeholder="Type your response..."
                    placeholderTextColor="#6B7280"
                    multiline
                    style={{
                      color: '#FFFFFF',
                      fontSize: 14,
                      minHeight: 140,
                      textAlignVertical: 'top',
                    }}
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="self-end bg-white rounded-full px-5 py-2"
                  onPress={() => {
                    const trimmed = reflectionText.trim();
                    if (!trimmed) {
                      return;
                    }
                    if (editingReflectionId) {
                      setReflections((prev) =>
                        prev.map((r) =>
                          r.id === editingReflectionId
                            ? { ...r, prompt: activePrompt, text: trimmed }
                            : r
                        )
                      );
                    } else {
                      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                      setReflections((prev) => [
                        {
                          id,
                          prompt: activePrompt,
                          text: trimmed,
                        },
                        ...prev,
                      ]);
                    }
                    setShowReflectionModal(false);
                    setActivePrompt(null);
                    setActivePromptColor(null);
                    setReflectionText('');
                    setEditingReflectionId(null);
                  }}
                >
                  <Text className="text-black text-sm font-semibold">
                    Save
                  </Text>
                </TouchableOpacity>
              </>
            )}
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
}
