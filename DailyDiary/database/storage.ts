import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'
import {
    addDiaryEntry,
    deleteDiaryEntry,
    getAllDiaryEntries,
    getDiaryEntryById,
    createTables,
    DiaryTable,
} from './diaryRepository'

const K_DONE = 'onboarding.done'
const K_NAME = 'user.name'
const K_PIN = 'user.pinEnabled'
const K_PIN_VALUE = 'user.pinHash' // wir speichern jetzt den Hash

export const storage = {
    /* ---------- USER ---------- */
    getDone: async (): Promise<boolean> => {
        const val = await AsyncStorage.getItem(K_DONE)
        return val === 'true'
    },

    setDone: () => AsyncStorage.setItem(K_DONE, 'true'),

    getName: () => AsyncStorage.getItem(K_NAME),
    setName: (v: string) => AsyncStorage.setItem(K_NAME, v),

    getPinEnabled: async (): Promise<boolean> => {
        const val = await AsyncStorage.getItem(K_PIN)
        return val === 'true'
    },
    setPinEnabled: (v: boolean) => AsyncStorage.setItem(K_PIN, String(v)),

    setSecret: (v: string) => SecureStore.setItemAsync('user.secret', v),
    getSecret: () => SecureStore.getItemAsync('user.secret'),

    setPin: async (pin: string) => {
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            pin
        )
        await SecureStore.setItemAsync(K_PIN_VALUE, hash)
        await AsyncStorage.setItem(K_PIN, 'true')
    },

    getPinHash: () => SecureStore.getItemAsync(K_PIN_VALUE),

    checkPin: async (pin: string) => {
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            pin
        )
        const stored = await SecureStore.getItemAsync(K_PIN_VALUE)
        return stored === hash
    },

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

    deleteEntry: async (id: number): Promise<void> => {
        return await deleteDiaryEntry(id)
    },
}
