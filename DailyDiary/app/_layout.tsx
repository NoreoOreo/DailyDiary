import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

// Splash sichtbar halten bis ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync(); // Splash jetzt ausblenden
        }
    }, [loaded]);

    if (!loaded) return null; // solange bleibt Splashscreen

    const bg = useMemo(
        () => (colorScheme === 'dark' ? '#3E0703' : '#660B05'),
        [colorScheme]
    );

    return (
        <View style={{ flex: 1, backgroundColor: bg }}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
            <StatusBar style="light" />
        </View>
    );
}
