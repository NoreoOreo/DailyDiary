import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { storage } from "../database/storage";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const done = await storage.getDone();
            console.log("onboarding done?", done);
            setNeedsOnboarding(!done);
            setReady(true);
            await SplashScreen.hideAsync();
        })();
    }, []);

    if (!ready || needsOnboarding === null) return null;

    return (
        <View style={{ flex: 1, backgroundColor: "#660B05" }}>
            <Stack screenOptions={{ headerShown: false }}>
                {needsOnboarding ? (
                    <Stack.Screen name="onboarding" />
                    ) : (
                    <Stack.Screen name="(tabs)" />
                    )}
                <Stack.Screen name="+not-found" />
            </Stack>
        </View>
    );
}
