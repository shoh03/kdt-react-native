import { AudioModule, AudioQuality, IOSOutputFormat, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder, useAudioRecorderState } from "expo-audio"
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function index() {
    
    const [recordedUri, setRecordedUri] = useState<string | null>(null)
    const [statusMessage, setStatusMessage] = useState<string>("버튼을 눌러서 녹음을 해주세요.")

    const audioRecorder = useAudioRecorder({
        extension: '.m4a', // 저장될 파일의 확장자
        sampleRate: 44100, // 음질 수준(44.1kHz)
        numberOfChannels: 2, // 채널 수
        bitRate: 128000, // 비트 bps(높을수록 고음질)
        // 안드로이드
        android: {
            outputFormat: 'mpeg4',
            audioEncoder: 'aac',
        },
        // IOS
        ios: {
            outputFormat: IOSOutputFormat.MPEG4AAC,
            audioQuality: AudioQuality.MAX,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
        // 웹
        web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
        },
    })

    // 오디오 플레이어
    const player = useAudioPlayer(recordedUri)

    // 녹음 상태(녹음 중, 경과 시간)
    const recoderState = useAudioRecorderState(audioRecorder)

    // 재생 상태
    const playerState = useAudioPlayerStatus(player)

    // 시간 포멧 함수
    const formatTime = (seconds: number) => {
        const totalSeconds = Math.floor(seconds || 0)
        const minutes = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60 
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }

    // 상황별 텍스트, 오디오 시간
    let timeText = "00:00";
    let timeColor = "#d9d9d9"

    if(recoderState.isRecording){
        // 녹음중일때
        timeText = `${formatTime(recoderState.durationMillis / 1000)}`
        timeColor = "#ef4444"
    }else if(recordedUri){
        // 녹음 파일이 있을 때
        const prefix = playerState.playing ? "▶ " : ""
        timeText = `${prefix}${formatTime(playerState.currentTime)} / ${formatTime(playerState.duration)}`
        timeColor = playerState.playing ? "#2563eb" : "#9ca3af"
    }

    // 녹음 시작 함수
    const startRecording = async () => {
        const permission = await AudioModule.requestRecordingPermissionsAsync()
        if(!permission.granted) {
            setStatusMessage("마이크 권한이 거부되었습니다.")
            return;
        }

        if(playerState.playing){
            player.pause()
        }

        // 오디오 세션으로 전환
        await setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
        })

        // 녹음 준비 시작
        await audioRecorder.prepareToRecordAsync()
        audioRecorder.record()
        setStatusMessage("녹음 중...")
    }
    
    // 녹음 중지 함수
    const stopRecording = async () => {
        await audioRecorder.stop()

        await setAudioModeAsync({
            allowsRecording: false,
            playsInSilentMode: true,
        })
        setRecordedUri(audioRecorder.uri)
        setStatusMessage("녹음이 완료되었습니다.")
    }

    // 녹음 파일을 재생 함수
    const playRecording = async () => {
        if(!recordedUri){
            setStatusMessage("재생할 녹음 파일이 없습니다.")
            return;
        }

        player.seekTo(0) // 가장 처음으로 이동
        player.play()
        setStatusMessage("녹음 파일 재생중...")
    }

    return (
        <ScrollView>
            <View>
                <Text 
                    className="text-center text-xl font-bold mb-6"
                >오디오 녹음 및 재생</Text>
                <Text
                    className="text-center text-5xl font-bold mb-3 tracking-wider font-variant-numberic-[tabular-nums]"
                >{timeText}</Text>
                <Text
                    className="text-sm text-gray-600 text-center"
                >{statusMessage}</Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={startRecording}
                    className="m-4 p-3 bg-blue-500 rounded-lg"
                >
                    <Text className='text-white text-[20px]'>녹음 시작</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={stopRecording}
                    className="m-4 p-3 bg-red-500 rounded-lg"
                >
                    <Text className='text-white text-[20px]'>녹음 중지</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={playRecording}
                    className="m-4 p-3 bg-green-500 rounded-lg"
                >
                    <Text className='text-white text-[20px]'>녹음 파일 재생</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}