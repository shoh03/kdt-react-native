import { cn } from '@/lib/utils'
import * as Haptics from "expo-haptics"
import { ScrollView, Text, TouchableOpacity, View, Vibration } from 'react-native'

export default function index() {

    const buttonStyle = "m-4 p-3 bg-blue-500 rounded-lg"
    const textStyle = "flex justify-center text-white"

    const triggerImpact = [
        {
            content: "진동 임펙트: 가볍게(Light)",
            enum: Haptics.ImpactFeedbackStyle.Light
        },
        {
            content: "진동 임펙트: 중간(Medium)",
            enum: Haptics.ImpactFeedbackStyle.Medium
        },
        {
            content: "진동 임펙트: 강하게(Heavy)",
            enum: Haptics.ImpactFeedbackStyle.Heavy
        },
        {
            content: "진동 임펙트: 단단하게(Rigid)",
            enum: Haptics.ImpactFeedbackStyle.Rigid
        }
    ]

    const triggerImpactButtons = triggerImpact.map((item, i) => (
        <TouchableOpacity
            key={i}
            onPress={() => {
                Haptics.impactAsync(item.enum)
            }}
            className={cn(buttonStyle)}
        >
            <Text className={cn(textStyle)}>{item.content}</Text>
        </TouchableOpacity>
    ))
    
    const triggerNotification = [
        {
            content: "진동 임펙트: 성공(Success)",
            enum: Haptics.NotificationFeedbackType.Success
        },
        {
            content: "진동 임펙트: 경고(Warning)",
            enum: Haptics.NotificationFeedbackType.Warning
        },
        {
            content: "진동 임펙트: 에러(Error)",
            enum: Haptics.NotificationFeedbackType.Error
        }
    ]

    const triggerNotificationButtons = triggerNotification.map((item, i) => (
        <TouchableOpacity
            key={i}
            onPress={() => {
                Haptics.notificationAsync(item.enum)
            }}
            className={cn(buttonStyle)}
        >
            <Text className={cn(textStyle)}>{item.content}</Text>
        </TouchableOpacity>
    ))

    const triggerDuration = [
        {
            content: "진동 시간: 0.5초(500ms)",
            duration: 500
        },
        {
            content: "진동 시간: 1초(1000ms)",
            duration: 1000
        },
        {
            content: "진동 시간: 2초(2000ms)",
            duration: 2000
        }
    ]

    const triggerDurationButtons = triggerDuration.map((item,i) => (
        <TouchableOpacity
            key={i}
            onPress={() => {
                Vibration.vibrate(item.duration)
            }}
            className={cn(buttonStyle)}
        >
            <Text className={cn(textStyle)}>{item.content}</Text>
        </TouchableOpacity>
    ))


    return (
        <ScrollView>
            <View>
                {triggerImpactButtons}
            </View>
            <View>
                {triggerNotificationButtons}
            </View>
            <View>
                {triggerDurationButtons}
            </View>
        </ScrollView>
    )
}