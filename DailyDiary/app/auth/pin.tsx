import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../../database/storage';

const BG = '#660B05';
const CREAM = '#FFF0C4';

export default function PinLoginScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        const ok = await storage.checkPin(pin);
        if (ok) {
            router.replace('/(tabs)');
        } else {
            setError('Wrong Pin, Try Again');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Text style={{ color: CREAM, fontSize: 24, marginBottom: 20 }}>Enter your PIN</Text>
            <TextInput
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                style={{
                    backgroundColor: CREAM,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 22,
                    width: 120,
                    textAlign: 'center',
                    marginBottom: 12,
                    letterSpacing: 8
                }}
            />
            {error ? <Text style={{ color: CREAM, marginBottom: 8 }}>{error}</Text> : null}
            <Pressable onPress={handleLogin} style={{ backgroundColor: CREAM, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 12 }}>
                <Text style={{ color: BG, fontWeight: '700' }}>Unlock</Text>
            </Pressable>
        </View>
    );
}
