import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../../database/storage';

const BG = '#660B05';
const CREAM = '#FFF0C4';

export default function PasswordChoiceScreen() {
    const router = useRouter();

    const finish = async (enable: boolean) => {
        await storage.setPinEnabled(enable);
        await storage.setDone();               // mark onboarding as finished
        router.replace('/(tabs)');             // jump into your main app
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

    return (
        <View style={{ flex: 1, backgroundColor: BG, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: CREAM, fontSize: 24, textAlign: 'center', marginBottom: 28 }}>
                Would you like to set a password for your Diary?
            </Text>

            <View style={{ flexDirection: 'row' }}>
                <Btn label="Yes" onPress={() => finish(true)} />
                <Btn label="No"  onPress={() => finish(false)} />
            </View>
        </View>
    );
}
