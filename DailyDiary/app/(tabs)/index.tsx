import { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { storage } from '../../database/storage'
import DiaryEntry from '../../models/diary'
import EntryListComponent from '@/components/EntryListComponent'

export default function HomeScreen() {
    const [entries, setEntries] = useState<DiaryEntry[]>([])

    const loadEntries = async () => {
        const allEntries = (await storage.getAllEntries()) as unknown as DiaryEntry[]
        if (allEntries?.length > 0) {
            const sorted = allEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 7)
            setEntries(sorted)
        } else {
            setEntries([])
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadEntries()
        }, [])
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Entries</Text>

            {entries.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>You have no Entries yet</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.subLabel}>&lt; Last 7 entries &gt;</Text>
                    <EntryListComponent entries={entries} />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7f1d1d',
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyBox: {
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 16,
    },
    subLabel: {
        color: '#7f1d1d',
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 4,
    },
})
