// app/(tabs)/add/step1.tsx
import React, { useCallback, useState } from 'react'
import { TextInput, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { StepFrame } from './StepFrame'
import { useWizard } from './_layout'
import { storage } from '@/database/storage'

function toYmd(d: Date | string) {
    const x = new Date(d)
    const y = x.getFullYear()
    const m = String(x.getMonth() + 1).padStart(2, '0')
    const day = String(x.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

export default function Step1() {
    const { data, setField } = useWizard()
    const r = useRouter()

    const [loading, setLoading] = useState(true)
    const [alreadyToday, setAlreadyToday] = useState(false)

    // Check beim Betreten des Screens (auch nach Back-Navigation)
    useFocusEffect(
        useCallback(() => {
            let mounted = true
            ;(async () => {
                setLoading(true)
                try {
                    const all = await storage.getAllEntries()
                    const today = toYmd(new Date())
                    const exists = (all ?? []).some(e => toYmd(e.date) === today)
                    if (mounted) setAlreadyToday(exists)
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
            return () => {
                mounted = false
            }
        }, [])
    )

    if (loading) {
        return (
            <StepFrame step={1} title="Checking…" disableNext>
                <View style={{ alignItems: 'center', padding: 24 }}>
                    <ActivityIndicator />
                </View>
            </StepFrame>
        )
    }

    if (alreadyToday) {
        // Hard block: heute schon ein Eintrag vorhanden
        return (
            <StepFrame
                step={1}
                title="Already done for today ✨"
                onPrev={() => r.replace('/(tabs)')} // zurück zu den Tabs / „My Entries“
                disableNext
            >
                <View style={{ gap: 10 }}>
                    <Text style={{ textAlign: 'center', color: '#9ca3af' }}>
                        You've already made a Daily Diary entry today. Great job!
                    </Text>
                    <Text style={{ textAlign: 'center', color: '#9ca3af' }}>
                        You can come back tomorrow for a new entry.
                    </Text>
                </View>
            </StepFrame>
        )
    }

    // normaler Flow, wenn noch keiner existiert
    return (
        <StepFrame
            step={1}
            title="What did you do today"
            onNext={() => r.push('/(tabs)/add/step2')}
            disableNext={!data.event.trim()}
        >
            <TextInput
                style={s.input}
                placeholder="Enter your answer"
                multiline
                value={data.event}
                onChangeText={(t) => setField('event', t)}
            />
        </StepFrame>
    )
}

const s = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        minHeight: 120,
    },
})
