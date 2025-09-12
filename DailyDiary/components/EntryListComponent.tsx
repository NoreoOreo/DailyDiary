import { FlatList, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import DiaryEntry from '../models/diary.js'

type Props = {
    entries: DiaryEntry[]
    onPressEntry?: (entry: DiaryEntry) => void
}

export default function EntryListComponent({ entries, onPressEntry }: Props) {
    const formatDate = (date: string | Date) => {
        const d = new Date(date)
        return d.toLocaleDateString('de-DE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        })
    }

    const renderItem = ({ item }: { item: DiaryEntry }) => (
        <TouchableOpacity
            onPress={() => onPressEntry?.(item)}
            style={styles.card}
        >
            {item.picture ? (
                <Image
                    source={{ uri: item.picture }}
                    style={styles.image}
                />
            ) : null}

            <View style={{ flex: 1 }}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <FlatList
            data={entries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
        />
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FEF3C7', // amber-100
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: '#92400E', // amber-800
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        color: '#78350F', // amber-900
        fontWeight: '600',
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginRight: 16,
    },
})
