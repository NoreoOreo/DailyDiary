import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '@/database/storage';

const BG = '#660B05';
const CREAM = '#FFF0C4';

export default function NameScreen() {
    const [name, setName] = useState('');
    const router = useRouter();

    const next = async () => {
        if (!name.trim()) return;
        await storage.setName(name.trim());
        // NICHT gleich done setzen – erst im password step
        router.push('/onboarding/password');
    };


    return (
        <View style={{ flex: 1, backgroundColor: BG, padding: 24, justifyContent: 'center' }}>
            <Text style={{ color: CREAM, fontSize: 34, fontWeight: '700', marginBottom: 16 }}>
                Hello There!
            </Text>

            <Text style={{ color: CREAM, fontSize: 20, lineHeight: 28, marginBottom: 24 }}>
                Looks like we don’t know each other yet. What should I call you?
            </Text>

            <TextInput
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,240,196,0.7)"
                value={name}
                onChangeText={setName}
                style={{
                    backgroundColor: CREAM,
                    color: '#3E0703',
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 16,
                }}
                returnKeyType="done"
                onSubmitEditing={next}
            />

            <Pressable
                onPress={next}
                style={{
                    marginTop: 16,
                    alignSelf: 'flex-end',
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: '#8C1007',
                }}
            >
                <Text style={{ color: CREAM, fontWeight: '700' }}>Continue</Text>
            </Pressable>
        </View>
    );
}
