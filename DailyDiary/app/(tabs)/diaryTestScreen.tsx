import React, { useEffect, useState } from 'react';
import { View, Button, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { createTables, addDiaryEntry, getAllDiaryEntries, deleteDiaryEntry, updateDiaryEntry } from '../../database/diaryRepository';

type DiaryTable = {
  id: number;
  title: string;
  event: string;
  positiveReflections: string;
  negativeReflections: string;
  lessonsLearned: string;
  date: string;
  picture?: string;
  caption?: string;
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 4 },
  entry: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontWeight: 'bold', fontSize: 16 },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  editBox: { marginTop: 8 },
});

export default function DiaryTestScreen() {
  const [entries, setEntries] = useState<DiaryTable[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEvent, setEditEvent] = useState('');

  const loadEntries = async () => {
    const data = await getAllDiaryEntries();
    setEntries(data);
    console.log('Aktuelle Einträge:', data);
  };

  useEffect(() => {
    const initDb = async () => {
      await createTables();
      await loadEntries();
    };
    initDb();
  }, []);

  const handleAddMock = async () => {
    await addDiaryEntry({
      title: newTitle || 'Mock Title',
      event: 'Mock Event',
      positiveReflections: 'Mock Good',
      negativeReflections: 'Mock Bad',
      lessonsLearned: 'Mock Learned',
      date: new Date().toISOString(),
      picture: undefined,
      caption: undefined,
    });
    setNewTitle('');
    loadEntries();
  };

  const handleDelete = async (id: number) => {
    await deleteDiaryEntry(id);
    loadEntries();
  };

  const startEdit = (id: number, title: string, event: string) => {
    setEditId(id);
    setEditTitle(title);
    setEditEvent(event);
  };

  const handleEdit = async () => {
    if (editId !== null) {
      await updateDiaryEntry(editId, { title: editTitle, event: editEvent });
      setEditId(null);
      setEditTitle('');
      setEditEvent('');
      loadEntries();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Diary Test Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Neuer Titel für Mock-Eintrag"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <Button title="Mock-Eintrag hinzufügen" onPress={handleAddMock} />
      <FlatList
        data={entries}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.event}</Text>
            <View style={styles.row}>
              <Button title="Löschen" onPress={() => handleDelete(item.id)} />
              <Button title="Bearbeiten" onPress={() => startEdit(item.id, item.title, item.event)} />
            </View>
            {editId === item.id && (
              <View style={styles.editBox}>
                <TextInput
                  style={styles.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Neuer Titel"
                />
                <TextInput
                  style={styles.input}
                  value={editEvent}
                  onChangeText={setEditEvent}
                  placeholder="Neues Event"
                />
                <Button title="Speichern" onPress={handleEdit} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}