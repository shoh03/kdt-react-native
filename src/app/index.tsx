import { Redirect, router } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { cn } from "./lib/utils";


// TouchableOpacity == a
// Pressable == button
export default function HomeScreen() {

    const buttonStyle = "m-4 p-3 bg-blue-500 rounded-lg"
    const textStyle = "flex justify-center text-white"
    const tags = [
        "view",
        "flatlist",
        "stack"
    ]

    const tagList = tags.map((tag, i) => (
        <Pressable
            key={i}
            onPress={() => router.push(`/${tag}` as any)}
            className={cn(buttonStyle)}
        >
            <Text className={cn(textStyle)}>{tag}</Text>
        </Pressable>
    ))

    return (
        <View>
            {/* 글자 클릭 */}
            <TouchableOpacity
                className="m-4 p-3 bg-blue-500 rounded-lg"
                onPress={() => router.push("/home")}
            >
                <Text className="flex justify-center text-white">Tabs</Text>
            </TouchableOpacity>

            {tagList}
        </View>
    )
    
    // return <Redirect href="/home" />
}
