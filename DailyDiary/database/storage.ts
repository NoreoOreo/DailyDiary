import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import {
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    getAllDiaryEntries,
    getDiaryEntryById,
    createTables,
    DiaryTable,
} from './diaryRepository'

const K_DONE = 'onboarding.done'
const K_NAME = 'user.name'
const K_PIN = 'user.pinEnabled'

export const storage = {
    /* ---------- USER ---------- */
    getDone: async () => (await AsyncStorage.getItem(K_DONE)) === 'true',
    setDone: () => AsyncStorage.setItem(K_DONE, 'true'),

    getName: () => AsyncStorage.getItem(K_NAME),
    setName: (v: string) => AsyncStorage.setItem(K_NAME, v),

    getPinEnabled: async () => (await AsyncStorage.getItem(K_PIN)) === 'true',
    setPinEnabled: (v: boolean) => AsyncStorage.setItem(K_PIN, String(v)),

    setSecret: (v: string) => SecureStore.setItemAsync('user.secret', v),
    getSecret: () => SecureStore.getItemAsync('user.secret'),

    /* ---------- DIARY ---------- */
    init: async () => {
        await createTables()
    },

    getAllEntries: async (): Promise<DiaryTable[]> => {
        return await getAllDiaryEntries()
    },

    getEntryById: async (id: number): Promise<DiaryTable | undefined> => {
        return await getDiaryEntryById(id)
    },

    addEntry: async (entry: Omit<DiaryTable, 'id'>): Promise<void> => {
        return await addDiaryEntry(entry)
    },

    updateEntry: async (id: number, entry: Partial<Omit<DiaryTable, 'id'>>): Promise<void> => {
        return await updateDiaryEntry(id, entry)
    },

    deleteEntry: async (id: number): Promise<void> => {
        return await deleteDiaryEntry(id)
    },
}
