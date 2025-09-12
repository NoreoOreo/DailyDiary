import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
    const colorScheme = useColorScheme()

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.palette.cream,
                tabBarInactiveTintColor: Colors.palette.cream,
                tabBarStyle: {
                    backgroundColor: Colors.palette.primary,
                },
            }}
        >
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar Overview',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="diaryTestScreen"
                options={{
                    title: 'Diary',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    title: 'My Entries',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
