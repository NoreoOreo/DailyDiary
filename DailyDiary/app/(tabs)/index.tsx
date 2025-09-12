import { useState, useCallback, useMemo } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import { storage } from '../../database/storage'
import DiaryEntry from '../../models/diary'
import EntryListComponent from '@/components/EntryListComponent'

const PAGE_SIZE = 7

export default function HomeScreen() {
    const [allEntries, setAllEntries] = useState<DiaryEntry[]>([])
    const [page, setPage] = useState(0) // wird nach Load auf "letzte Seite" gesetzt

    const loadEntries = async () => {
        const data = (await storage.getAllEntries()) as unknown as DiaryEntry[]
        // ⬇️ global aufsteigend (älteste → neueste)
        const sorted = (data ?? []).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        setAllEntries(sorted)

        // ⬇️ immer auf die rechte (neueste) Seite springen
        const lastPage = Math.max(0, Math.ceil(sorted.length / PAGE_SIZE) - 1)
        setPage(lastPage)
    }

    useFocusEffect(
        useCallback(() => {
            loadEntries()
        }, [])
    )

    const totalPages = Math.max(1, Math.ceil(allEntries.length / PAGE_SIZE))
    const hasEntries = allEntries.length > 0
    const hasPrev = page > 0                 // linke Seite (älter)
    const hasNext = page < totalPages - 1    // rechte Seite (neuer)

    // ⬇️ Slicing je Seite – Reihenfolge innerhalb der Seite bleibt aufsteigend
    const pageItems = useMemo(() => {
        const start = page * PAGE_SIZE
        return allEntries.slice(start, start + PAGE_SIZE)
    }, [allEntries, page])

    const IconButtonOrSpacer = ({
                                    show,
                                    onPress,
                                    name,
                                }: {
        show: boolean
        onPress: () => void
        name: keyof typeof Ionicons.glyphMap
    }) =>
        show ? (
            <TouchableOpacity onPress={onPress} style={styles.iconBtn} hitSlop={8}>
                <Ionicons name={name} size={18} color="#7f1d1d" />
            </TouchableOpacity>
        ) : (
            <View style={styles.iconBtn} />
        )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Entries</Text>

            {!hasEntries ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>You have no Entries yet</Text>
                </View>
            ) : (
                <>
                    <View style={styles.navRow}>
                        {/* ← ältere Seite (links) */}
                        <IconButtonOrSpacer
                            show={hasPrev}
                            onPress={() => setPage(p => Math.max(0, p - 1))}
                            name="chevron-back"
                        />
                        <Text style={styles.subLabel}>Last 7 entries</Text>
                        {/* → neuere Seite (rechts) */}
                        <IconButtonOrSpacer
                            show={hasNext}
                            onPress={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            name="chevron-forward"
                        />
                    </View>

                    <EntryListComponent entries={pageItems} />
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
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
        marginLeft: 4,
    },
    subLabel: {
        color: '#7f1d1d',
        fontSize: 12,
    },
    iconBtn: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
