import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../../database/storage';

const BG = '#660B05';
const CREAM = '#FFF0C4';

export default function PasswordChoiceScreen() {
    const router = useRouter();
    const [showPinInput, setShowPinInput] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const finish = async (enable: boolean) => {
        await storage.setPinEnabled(enable);
        await storage.setDone();               // mark onboarding as finished
        router.replace('/(tabs)');             // jump into your main app
    };

    const handleYes = () => setShowPinInput(true);

    const handleSetPin = async () => {
        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }
        await storage.setPin(pin); // You need to implement setPin in your storage
        await finish(true);
    };

    const Btn = ({ label, onPress }: { label: string; onPress: () => void }) => (
        <Pressable
            onPress={onPress}
            style={{
                backgroundColor: CREAM,
                paddingHorizontal: 22,
                paddingVertical: 12,
                borderRadius: 12,
                marginHorizontal: 8,
            }}
        >
            <Text style={{ color: '#3E0703', fontWeight: '700' }}>{label}</Text>
        </Pressable>
    );

    if (showPinInput) {
        return (
            <View style={{ flex: 1, backgroundColor: BG, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: CREAM, fontSize: 24, textAlign: 'center', marginBottom: 20 }}>
                    Set a 4-digit PIN
                </Text>
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
                        letterSpacing: 8,
                    }}
                />
                {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
                <Btn label="Set PIN" onPress={handleSetPin} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: BG, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: CREAM, fontSize: 24, textAlign: 'center', marginBottom: 28 }}>
                Would you like to set a password for your Diary?
            </Text>

            <View style={{ flexDirection: 'row' }}>
                <Btn label="Yes" onPress={handleYes} />
                <Btn label="No"  onPress={() => finish(false)} />
            </View>
        </View>
    );
}
