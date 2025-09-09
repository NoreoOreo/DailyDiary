import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const K_DONE = 'onboarding.done';
const K_NAME = 'user.name';
const K_PIN  = 'user.pinEnabled';

export const storage = {
    getDone: async () => (await AsyncStorage.getItem(K_DONE)) === 'true',
    setDone: () => AsyncStorage.setItem(K_DONE, 'true'),

    getName: () => AsyncStorage.getItem(K_NAME),
    setName: (v: string) => AsyncStorage.setItem(K_NAME, v),

    getPinEnabled: async () => (await AsyncStorage.getItem(K_PIN)) === 'true',
    setPinEnabled: (v: boolean) => AsyncStorage.setItem(K_PIN, String(v)),

    // optional für später: Secret speichern
    setSecret: (v: string) => SecureStore.setItemAsync('user.secret', v),
    getSecret: () => SecureStore.getItemAsync('user.secret'),
};
