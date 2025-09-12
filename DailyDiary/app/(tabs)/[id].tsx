import { useLocalSearchParams } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { DiaryEntryView } from '../../components/DiaryEntryView';
import { storage } from '../../database/storage';
import { useEffect, useState } from 'react';
import { DiaryTable } from '../../database/diaryRepository';


/* 
This screen displays the details of a diary entry based on the ID from the URL
it fetches the entry from storage and shows a loading indicator while fetching.
if no entry is found, it shows a "Not found" message.
it uses the DiaryEntryView component to render the entry details.
it shows the entries of 
*/
export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<DiaryTable | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntry() {
      if (id) {
        const found = await storage.getEntryById(Number(id));
        setEntry(found ?? null);
      }
      setLoading(false);
    }
    fetchEntry();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <DiaryEntryView
          entry={{
            id: 0,
            title: 'Not found',
            event: '',
            positiveReflections: '',
            negativeReflections: '',
            lessonsLearned: '',
            date: '',
            picture: '',
            caption: '',
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <DiaryEntryView entry={entry} />
    </View>
  );
}
