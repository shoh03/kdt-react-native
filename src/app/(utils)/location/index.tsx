import { cn } from '@/lib/utils';
import * as Location from "expo-location";
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface LocationData {
    latitude: number;
    longitude: number;
}

export default function index() {

    const [statusMessage, setstatusMessage] = useState<string>("버튼을 눌러서 위치 정보를 가져오세요.")
    const [locationData, setlocationData] = useState<LocationData | null>(null)

    const buttonStyle = "m-4 p-3 bg-blue-500 rounded-lg"
    const textStyle = "flex justify-center text-white"

    const getLocation = async () => {
        setstatusMessage("권한 확인중...")

        const {status} = await Location.requestForegroundPermissionsAsync()
        if(status !== "granted") {
            setstatusMessage("위치 권한이 거부되었습니다.")
            return;
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        })

        const { latitude, longitude} = location.coords;
        setlocationData({latitude, longitude})
        setstatusMessage("위치 정보를 성공적으로 가져왔습니다.")
    }

    return (
        <View>
            {locationData ? (
                <View>
                    <Text className='text-[20px]'>위도(Latitude): {locationData.latitude}</Text>
                    <Text className='text-[20px]'>경도(Longitude): {locationData.longitude}</Text>
                </View>
                ) : (
                    <Text>{statusMessage}</Text>
                )
            }
            <View>
                <TouchableOpacity
                    onPress={getLocation}
                    className={cn(buttonStyle)}
                >
                    <Text className={cn(textStyle)}>위치 정보 가져오기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}