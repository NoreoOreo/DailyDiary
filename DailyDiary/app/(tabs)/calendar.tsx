import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Colors } from '@/constants/Colors';
import { View, Text, StyleSheet } from 'react-native';

export default function CalendarScreen() {
  const [selected, setSelected] = useState<string | undefined>();

  // Helper to format the selected date
  function formatSelectedDate(dateString?: string) {
    if (!dateString) return 'No day selected';
    const date = new Date(dateString);
    // Get short weekday and month names
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon
    const month = date.toLocaleDateString('en-US', { month: 'short' });     // e.g., Sep
    const day = date.getDate();                                             // e.g., 15
    return `${weekday}, ${month} ${day}`;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>
          {formatSelectedDate(selected)}
        </Text>
      </View>
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={
          selected
            ? {
                [selected]: {
                  selected: true,
                  selectedColor: Colors.palette.primary,
                  selectedTextColor: Colors.palette.cream,
                  customStyles: {
                    text: {
                      fontWeight: 'bold',
                    },
                  },
                },
              }
            : undefined
        }
        markingType={'custom'}
        theme={{
          monthTextColor: Colors.palette.primary,
          textMonthFontWeight: 'bold',
          textMonthFontSize: 20,
          dayTextColor: Colors.palette.primary,
          todayTextColor: Colors.palette.accent,
          arrowColor: Colors.palette.primary,
          textSectionTitleColor: Colors.palette.primary,
          selectedDayBackgroundColor: Colors.palette.primary,
          selectedDayTextColor: Colors.palette.cream,
          textDayFontWeight: 'normal',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: Colors.palette.primary,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarText: {
    color: Colors.palette.cream,
    fontSize: 18,
    fontWeight: 'bold',
  },
});