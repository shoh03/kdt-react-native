import "@/global.css";
import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactQueryProvider from "../../providers/ReactQueryProvider";

// div == View
// Slot == Outlet
export default function TabLayout() {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        setIsReady(true)
    }, [])

    // 로딩화면
    if(!isReady) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 bg-white" />
            </SafeAreaView>
        )
    }

    return (
        <ReactQueryProvider>
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 bg-white">
                    <Slot />
                </View>
            </SafeAreaView>
        </ReactQueryProvider>
    );
}

