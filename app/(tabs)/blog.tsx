import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { doc, getDoc, Timestamp, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { signInAnonymouslyIfNeeded } from '../../auth';

type CustomQuote = {
  quoteText: string;
  author: string | null;
  source: string | null;
  dateCreated?: Timestamp | Date;
};

export default function BlogScreen() {
  const [customQuotes, setCustomQuotes] = useState<CustomQuote[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuoteText, setEditQuoteText] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editSource, setEditSource] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    const loadCustomQuotes = async () => {
      try {
        const user = await signInAnonymouslyIfNeeded();
        setUserId(user.uid);
        const userContentRef = doc(db, 'userContent', user.uid);
        const snap = await getDoc(userContentRef);

        if (snap.exists()) {
          const data = snap.data() as { customQuotes?: CustomQuote[] };
          setCustomQuotes(data.customQuotes ?? []);
        }
      } catch (error) {
        console.warn('Failed to load custom quotes:', error);
      }
    };

    loadCustomQuotes();
  }, []);

  const startEditing = (index: number) => {
    const item = customQuotes[index];
    setEditingIndex(index);
    setEditQuoteText(item.quoteText);
    setEditAuthor(item.author ?? '');
    setEditSource(item.source ?? '');
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditQuoteText('');
    setEditAuthor('');
    setEditSource('');
  };

  const saveEdit = async () => {
    if (editingIndex === null || !userId) return;
    if (!editQuoteText.trim()) {
      Alert.alert('Quote required', 'Please enter a quote.');
      return;
    }

    try {
      setIsSavingEdit(true);
      const updated = [...customQuotes];
      updated[editingIndex] = {
        ...updated[editingIndex],
        quoteText: editQuoteText.trim(),
        author: editAuthor.trim() || null,
        source: editSource.trim() || null,
      };
      setCustomQuotes(updated);

      const ref = doc(db, 'userContent', userId);
      await updateDoc(ref, {
        customQuotes: updated,
        dateModified: serverTimestamp(),
      });

      cancelEditing();
    } catch (error) {
      console.warn('Failed to save edited quote:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteQuote = async (index: number) => {
    if (!userId) return;

    Alert.alert('Delete quote', 'Are you sure you want to delete this quote?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = customQuotes.filter((_, i) => i !== index);
            setCustomQuotes(updated);

            const ref = doc(db, 'userContent', userId);
            await updateDoc(ref, {
              customQuotes: updated,
              dateModified: serverTimestamp(),
            });
          } catch (error) {
            console.warn('Failed to delete quote:', error);
            Alert.alert('Error', 'Failed to delete quote. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerClassName="px-4 pt-6 pb-8">
        <Text className="text-white text-2xl font-semibold mb-4">
          Custom Quotes
        </Text>

        {customQuotes.length === 0 ? (
          <Text className="text-step-400 text-sm">
            You haven&apos;t added any custom quotes yet. Tap the Add button to
            create one.
          </Text>
        ) : (
          customQuotes.map((item, index) => {
            const isEditing = editingIndex === index;

            return (
              <View
                key={`${item.quoteText}-${index}`}
                className="mb-4 p-4 rounded-2xl bg-step-900 border border-step-700"
              >
                {isEditing ? (
                  <>
                    <TextInput
                      value={editQuoteText}
                      onChangeText={setEditQuoteText}
                      placeholder="Edit quote"
                      placeholderTextColor="#666"
                      multiline
                      className="text-white border border-step-700 rounded-xl p-2 bg-step-900"
                    />
                    <TextInput
                      value={editAuthor}
                      onChangeText={setEditAuthor}
                      placeholder="Author (optional)"
                      placeholderTextColor="#666"
                      className="text-white border border-step-700 rounded-xl p-2 bg-step-900 mt-2"
                    />
                    <TextInput
                      value={editSource}
                      onChangeText={setEditSource}
                      placeholder="Source (optional)"
                      placeholderTextColor="#666"
                      className="text-white border border-step-700 rounded-xl p-2 bg-step-900 mt-2"
                    />
                    <View className="flex-row mt-3 justify-end gap-3">
                      <TouchableOpacity onPress={cancelEditing} activeOpacity={0.7}>
                        <Text className="text-step-300 text-sm">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={saveEdit}
                        activeOpacity={0.8}
                        disabled={isSavingEdit}
                        className="px-3 py-1 rounded-full bg-step-700 border border-step-500"
                      >
                        {isSavingEdit ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text className="text-white text-sm font-medium">
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text className="text-white text-base font-semibold italic">
                      {item.quoteText}
                    </Text>
                    {(item.author || item.source) && (
                      <Text className="text-step-300 text-xs mt-2">
                        {item.author ?? item.source}
                      </Text>
                    )}
                    <View className="flex-row mt-3 justify-end gap-4">
                      <TouchableOpacity
                        onPress={() => startEditing(index)}
                        activeOpacity={0.7}
                      >
                        <Text className="text-step-300 text-xs">Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteQuote(index)}
                        activeOpacity={0.7}
                      >
                        <Text className="text-red-500 text-xs">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

