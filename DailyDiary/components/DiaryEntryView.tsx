import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DiaryTable } from '../database/diaryRepository';

interface DiaryEntryViewProps {
  entry: DiaryTable;
}

export const DiaryEntryView: React.FC<DiaryEntryViewProps> = ({ entry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.diaryContent}>
        <Text style={styles.title}>{entry.title}</Text>
        <Section label="What did you do today?" content={entry.event} />
        <Section label="What went well today?" content={entry.positiveReflections} />
        <Section label="What went not so well today?" content={entry.negativeReflections} />
        <Section label="Learning of Today" content={entry.lessonsLearned} />
        {entry.picture && (
          <View style={styles.pictureSection}>
            <Image source={{ uri: entry.picture }} style={styles.image} resizeMode="contain" />
            {entry.caption && <Text style={styles.caption}>{entry.caption}</Text>}
          </View>
        )}
      </View>
    </View>
  );
};

const Section: React.FC<{ label: string; content: string }> = ({ label, content }) => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    margin: 8,
    height: '95%',
    flexDirection: 'row', // red line on the left, content on the right
  },
  diaryContent: {
    flex: 1,
    padding: 16,
    marginLeft: 20,   // space between container edge and red line
    paddingLeft: 10,        // space between red line and text
    borderLeftColor: '#B71C1C',
    borderLeftWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#660B05',
    marginBottom: 12,
    textAlign: 'center',
    width: '100%',
  },
  section: {
    marginBottom: 10,
    width: '100%',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#660B05',
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  sectionContent: {
    fontSize: 15,
    color: '#3E0703',
    textAlign: 'center',
    width: '100%',
  },
  pictureSection: {
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  image: {
    width: 220,
    height: 160,
    borderRadius: 8,
    marginBottom: 6,
  },
  caption: {
    fontStyle: 'italic',
    color: '#660B05',
    fontSize: 13,
    textAlign: 'center',
    width: '100%',
  },
});



export default DiaryEntryView;
