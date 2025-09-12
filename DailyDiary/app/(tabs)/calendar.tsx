// app/(tabs)/calendar.tsx
import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
// @ts-ignore
import { Calendar, DateObject } from 'react-native-calendars'
import { useFocusEffect } from '@react-navigation/native'
import { Colors } from '@/constants/Colors'

import { storage } from '@/database/storage'
import DiaryEntry from '@/models/diary'
import EntryListComponent from '@/components/EntryListComponent'

/** Calendar liefert day.dateString als YYYY-MM-DD.
 * Wir normalisieren jede Entry-Date dazu, damit der Vergleich exakt ist. */
function toYmd(input: string | Date): string {
    const d = new Date(input)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

export default function CalendarScreen() {
    const [selected, setSelected] = useState<string | undefined>()
    const [entries, setEntries] = useState<DiaryEntry[]>([])

    // Einträge laden, sobald Screen im Fokus ist (auch nach Add/Delete)
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const all = (await storage.getAllEntries()) as unknown as DiaryEntry[]
                setEntries(all ?? [])
            })()
        }, [])
    )

    // Alle Tage, an denen es Einträge gibt (für Markierung im Kalender)
    const daysWithEntries = useMemo(() => {
        const set = new Set<string>()
        for (const e of entries) set.add(toYmd(e.date))
        return set
    }, [entries])

    // Einträge des selektierten Tages (exakt gleiches Datum)
    const entriesForSelected = useMemo(
        () => (selected ? entries.filter(e => toYmd(e.date) === selected) : []),
        [entries, selected]
    )

    // Markierungen zusammenbauen: Punkte für Tage mit Einträgen + ausgewählter Tag
    const marked = useMemo(() => {
        const base: Record<string, any> = {}
        daysWithEntries.forEach(ymd => {
            base[ymd] = {
                marked: true,
                dotColor: Colors.palette.primary,
            }
        })
        if (selected) {
            base[selected] = {
                ...(base[selected] ?? {}),
                selected: true,
                selectedColor: Colors.palette.primary,
                selectedTextColor: Colors.palette.cream,
                customStyles: { text: { fontWeight: 'bold' } },
            }
        }
        return base
    }, [daysWithEntries, selected])

    // hübscher Text oben
    function formatSelectedDate(dateString?: string) {
        if (!dateString) return 'No day selected'
        const date = new Date(dateString)
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        const day = date.getDate()
        return `${weekday}, ${month} ${day}`
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.topBar}>
                <Text style={styles.topBarText}>{formatSelectedDate(selected)}</Text>
            </View>

            <Calendar
                onDayPress={(day: DateObject) => setSelected(day.dateString)}
                markedDates={Object.keys(marked).length ? marked : undefined}
                markingType="simple"
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

            {/* Ergebnisbereich unter dem Kalender */}
            <View style={styles.resultBox}>
                {!selected ? (
                    <Text style={styles.hint}>Pick a day to see entries.</Text>
                ) : entriesForSelected.length === 0 ? (
                    <Text style={styles.hint}>No entry for this day.</Text>
                ) : (
                    <EntryListComponent
                        // ggf. sortieren wie bei dir üblich (hier aufsteigend innerhalb des Tages)
                        entries={[...entriesForSelected].sort(
                            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                        )}
                    />
                )}
            </View>
        </View>
    )
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
    resultBox: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    hint: {
        marginTop: 16,
        textAlign: 'center',
        color: '#9ca3af',
    },
})
