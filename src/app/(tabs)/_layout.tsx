import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"

export default function _layout() {
    return (
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen 
                name='home'
                options={{
                    title: "홈",
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons 
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color as any}
                        />
                    )
                }}
            >

            </Tabs.Screen>
            <Tabs.Screen 
                name='profile'
                options={{
                    title: "프로필",
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons 
                            name={focused ? "person" : "person-outline"}
                            size={size}
                            color={color as any}
                        />
                    )
                }}
            >

            </Tabs.Screen>
        </Tabs>
    )
}