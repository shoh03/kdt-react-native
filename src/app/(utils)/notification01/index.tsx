import { cn } from '@/lib/utils';
import Constants from 'expo-constants';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, // 알림음 재생
    shouldSetBadge: true, // 안 읽은 알람 개수 표시
    shouldShowBanner: true, // 배너 형태로 팝업
    shouldShowList: true, // 알림센터 드래그로 내리는 목록에 표시
    shouldShowAlert: true // 팝업 알림 표시 여부
  }),
});

export default function index() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("버튼을 눌러 토큰을 발급받으세요.")

    const buttonStyle = "m-4 p-3 bg-blue-500 rounded-lg"
    const textStyle = "flex justify-center text-white"
    
    // 푸시 토큰 발급 함수
    const getPushToken = async () => {
        if(!Device.isDevice){
            Alert.alert("애뮬레이터(시뮬레이터) 실제 푸시토큰 발급이 되지 않습니다.")
            return
        }

        // ios생략, 안드로이드 채널 설정
        if(Platform.OS === "android"){
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C"
            })
        }

        setStatusMessage("권한 확인중...")

        const {status: existingStatus} = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus

        if(existingStatus !== "granted"){
            const {status} = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        
        if(finalStatus !== "granted"){
            setStatusMessage("알림 권한이 거부되었습니다.")
            Alert.alert("권한 거부, 설정에서 알림 권한을 설정해주세요.")
            return;
        }

        setStatusMessage("토큰 발급 중...")

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        
        const tokenData = await Notifications.getExpoPushTokenAsync({projectId})
        const token = tokenData.data;
        setExpoPushToken(token)
        setStatusMessage("토큰 발급 성공!")
    }

    return (
        <ScrollView>
            <Text>푸시 토큰 확인</Text>
            <Text>{statusMessage}</Text>
            {expoPushToken ? (
                <View>
                    <Text>{expoPushToken}</Text>
                </View>
            ): null}

            {/* 토큰 발급 버튼 */}
            <View>
                <TouchableOpacity
                    onPress={getPushToken}
                    className={cn(buttonStyle)}
                >
                    <Text className={cn(textStyle)}>푸시 토큰 발급하기</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}