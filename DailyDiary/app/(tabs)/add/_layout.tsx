import { Stack, useRouter } from 'expo-router'
import React, { createContext, useContext, useMemo, useState } from 'react'
import { storage } from '@/database/storage'
import type { AddEntryData } from './types'

type Ctx = {
    data: AddEntryData
    setField: <K extends keyof AddEntryData>(key: K, value: AddEntryData[K]) => void
    reset: () => void
    finish: () => Promise<void>
}

const defaultData: AddEntryData = {
    event: '',
    positiveReflections: '',
    negativeReflections: '',
    lessonsLearned: '',
    picture: null,
    caption: '',
    title: '',
    date: new Date().toISOString(),
}

const WizardCtx = createContext<Ctx | null>(null)
export const useWizard = () => {
    const v = useContext(WizardCtx)
    if (!v) throw new Error('useWizard must be used within WizardProvider')
    return v
}

export default function AddLayout() {
    const [data, setData] = useState<AddEntryData>(defaultData)
    const router = useRouter()

    const api: Ctx = useMemo(
        () => ({
            data,
            setField: (key, value) => setData(prev => ({ ...prev, [key]: value })),
            reset: () => setData(defaultData),
            finish: async () => {
                // ⬇️ hier der wichtige Fix: null → undefined fürs DB-Shape
                await storage.addEntry({
                    title: data.title,
                    event: data.event,
                    positiveReflections: data.positiveReflections,
                    negativeReflections: data.negativeReflections,
                    lessonsLearned: data.lessonsLearned,
                    date: data.date,
                    picture: data.picture ?? undefined,
                    caption: data.caption ?? undefined,
                })
                // zurück auf My Entries (index lädt via useFocusEffect neu)
                router.replace('/(tabs)/index')
            },
        }),
        [data, router]
    )

    return (
        <WizardCtx.Provider value={api}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="step1" />
                <Stack.Screen name="step2" />
                <Stack.Screen name="step3" />
                <Stack.Screen name="step4" />
                <Stack.Screen name="step5" />
                <Stack.Screen name="step6" />
            </Stack>
        </WizardCtx.Provider>
    )
}
