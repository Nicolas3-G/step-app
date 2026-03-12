import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { signInAnonymouslyIfNeeded } from '../auth';

export default function AddQuoteScreen() {
  const router = useRouter();
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!quoteText.trim()) {
      Alert.alert('Quote required', 'Please enter a quote.');
      return;
    }

    try {
      setIsSaving(true);
      const user = await signInAnonymouslyIfNeeded();

      const userContentRef = doc(db, 'userContent', user.uid);

      await updateDoc(userContentRef, {
        customQuotes: arrayUnion({
          quoteText: quoteText.trim(),
          author: author.trim() || null,
          source: source.trim() || null,
          // Use a plain Date so Firestore can convert it, since
          // serverTimestamp() isn't allowed inside arrayUnion objects.
          dateCreated: new Date(),
        }),
        dateModified: serverTimestamp(),
      });

      Alert.alert('Saved', 'Your quote has been added.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.warn('Failed to add quote:', error);
      Alert.alert('Error', 'Failed to add quote. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 px-5 pt-6">
        <Text className="text-white text-2xl font-semibold mb-4">
          Add a quote
        </Text>

        <Text className="text-step-300 mb-2 text-sm">Quote</Text>
        <TextInput
          value={quoteText}
          onChangeText={setQuoteText}
          placeholder="Write your quote..."
          placeholderTextColor="#666"
          multiline
          className="min-h-[100px] text-white border border-step-700 rounded-xl p-3 bg-step-900"
        />

        <Text className="text-step-300 mb-2 mt-4 text-sm">Author (optional)</Text>
        <TextInput
          value={author}
          onChangeText={setAuthor}
          placeholder="Who said it?"
          placeholderTextColor="#666"
          className="text-white border border-step-700 rounded-xl p-3 bg-step-900"
        />

        <Text className="text-step-300 mb-2 mt-4 text-sm">Source (optional)</Text>
        <TextInput
          value={source}
          onChangeText={setSource}
          placeholder="Book, podcast, etc."
          placeholderTextColor="#666"
          className="text-white border border-step-700 rounded-xl p-3 bg-step-900"
        />
      </View>

      <View className="px-5 pb-6">
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isSaving}
          className="bg-step-700 py-3 rounded-full border border-step-500 items-center"
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-semibold">Save quote</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="mt-3 py-2 items-center"
        >
          <Text className="text-step-300 text-sm">Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

