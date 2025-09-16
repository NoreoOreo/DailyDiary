import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { storage } from "@/database/storage";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
    const [needsPin, setNeedsPin] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            try {
                await storage.init();

                // NEU: Validate Onboarding
                const valid = await storage.validateOnboarding();
                const pinEnabled = await storage.getPinEnabled();

                setNeedsOnboarding(!valid);
                setNeedsPin(valid && pinEnabled); // nur wenn Onboarding fertig + PIN aktiv
            } catch (e) {
                console.error("App init error", e);
            } finally {
                setReady(true);
                await SplashScreen.hideAsync();
            }
        })();
    }, []);

    if (!ready || needsOnboarding === null || needsPin === null) return null;

    return (
        <View style={{ flex: 1, backgroundColor: "#660B05" }}>
            <Stack screenOptions={{ headerShown: false }}>
                {needsOnboarding ? (
                    <Stack.Screen name="onboarding" />
                ) : needsPin ? (
                    <Stack.Screen name="auth/pin" />
                ) : (
                    <Stack.Screen name="(tabs)" />
                )}
                <Stack.Screen name="+not-found" />
            </Stack>
        </View>
    );
}
