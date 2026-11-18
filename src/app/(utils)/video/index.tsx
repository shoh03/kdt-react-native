import { cn } from '@/lib/utils'
import { useEvent } from 'expo'
import { CameraType, CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera"
import { useVideoPlayer, VideoView } from "expo-video"
import { useEffect, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function index() {

    // 카메라, 마이크 접근 권한 관리
    const [cameraPermission, reqeustCameraPermission] = useCameraPermissions()
    const [micPermission, reqeustMicPermission] = useMicrophonePermissions()

    // 카메라 타입 관리
    const cameraRef = useRef<CameraView>(null);
    // 전면 / 후면
    const [facing, setFacing] = useState<CameraType>("back");
    const [isCameraReady, setCameraReady] = useState(false)

    const [mode, setMode] = useState<"camera" | "preview">("camera")
    const [videoUri, setVideoUri] = useState<string | null>(null)
    const [isRecording, setIsRecording] = useState(false)

    // 녹화 경과 시간
    const [recordSeconds, setRecordSeconds] = useState<number>(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // 비디오플레이어
    const player = useVideoPlayer(videoUri, (p) => {
        p.loop = false;
        p.timeUpdateEventInterval = 0.5 // 0.5초마다 재생 위치 이벤트 발생
    })

    // 재생 상태/ 현재 재생 상태 위치 구독
    const { isPlaying } = useEvent(player, "playingChange", {isPlaying: player.playing})
    const { currentTime } = useEvent(player, "timeUpdate", {
        currentTime: player.currentTime,
        currentLiveTimestamp: null,
        currentOffsetFromLive: null,
        bufferedPosition: 0,
    })

    useEffect(() => {
        return () => {
            if(timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    // 시간 포멧 함수
    const formatTime = (seconds: number) => {
        const totalSeconds = Math.floor(seconds || 0)
        const minutes = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60 
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }

    // 녹화 시작
    const startRecording = async () => {
        if(!cameraRef.current || !isCameraReady || isRecording) return;

        setIsRecording(true)
        setRecordSeconds(0)

        // 타이머 시작
        const startedAt = Date.now()
        timerRef.current = setInterval(() => {
            setRecordSeconds((Date.now() - startedAt) / 1000)
        }, 250)

        try {
            const video = await cameraRef.current.recordAsync({ maxDuration: 60 })
            if(video?.uri){
                setVideoUri(video.uri)
                setMode("preview")

                // API -> 호출
            }
        } catch (error) {
            console.log("녹화 실패")

        } finally {
            if(timerRef.current) clearInterval(timerRef.current)
            timerRef.current = null
            setIsRecording(false);
        }
    }

    // 녹화 중지
    const stopRecording = () => {
        cameraRef.current?.stopRecording();
    }

    // 재생 / 일시정지
    const togglePlay = () => {
        if(isPlaying){
            player.pause()
        }else{
            // 끝까지 재생했으면 처음부터 실행
            if(player.duration > 0 && player.currentTime >= player.duration - 0.1){
                player.currentTime = 0
            }
            player.play()
        }
    }

    // 다시 촬영
    const retake = () => {
        player.pause()
        setVideoUri(null)
        setRecordSeconds(0)
        setMode("camera")
    }

    // 업로드
    const uploadVideo = () => {
        if(!videoUri) return;
        // vedeo url -> formData append 후 API 전송
    }

    const actionButton = "flex-1 py-4 rounded-xl items-center"
    const actionText = "text-white font-bold text-base"
    const circleButton = "w-16 h-16 rounded-full bg-gray-700 justify-center items-center"

    // 퍼미션이 없는 경우
    if(!cameraPermission || !micPermission){
        return <View className="flex-1 bg-white"></View>
    }

    if(!cameraPermission.granted || !micPermission.granted){
        return (
            <View>
                <TouchableOpacity
                    onPress={async () => {
                        await reqeustCameraPermission()
                        await reqeustMicPermission()
                    }}
                    className="w-50 h-15 rounded-full bg-blue-500 justify-center items-center"
                >
                    <Text
                        className='text-white'
                    >권한 허용</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // 재생 화면
    if(mode === "preview" && videoUri){
        return (
            <View className='flex-1 bg-black'>
                <VideoView 
                    player={player}                
                    style={{flex: 1}}
                    contentFit="contain"
                    nativeControls={false}                
                />
                <Text
                    className={cn(
                        "absolute top-[60px] self-center text-[22px] font-bold tabular-nums", 
                        isPlaying ? "text-blue-400" : "text-gray-200"
                    )}
                >
                    {isPlaying ? "▶ " : ""}
                    {formatTime(currentTime)} / {formatTime(player.duration)}
                </Text>
                <View>
                    <TouchableOpacity
                        onPress={retake}
                        className={cn(actionButton, "bg-gray-600")}
                    >
                        <Text className={cn(actionText)}>다시 촬영</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={togglePlay}
                        className={cn(actionButton, "bg-blue-600")}
                    >
                        <Text className={cn(actionText)}>{isPlaying ? "일시정지" : "재생"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={uploadVideo}
                        className={cn(actionButton, "bg-green-600")}
                    >
                        <Text className={cn(actionText)}>업로드</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    // 촬영 화면
    return (
        <View className='flex-1 bg-black'>
            <CameraView 
                ref={cameraRef}
                style={{flex: 1}}
                facing={facing}
                mode="video"
                onCameraReady={() => setCameraReady(true)}
            />

            {/* 녹화시간 */}
            <Text
                className={cn(
                    "absolute top-[60px] self-center text-[22px] font-bold tabular-nums", 
                    isRecording ? "text-red-400" : "text-gray-200"
                )}
            >
                {isRecording ? "● " : ""}
                {formatTime(recordSeconds)}
            </Text>

            {/* 카메라 전환*/}
            <View className='flex-row items-center justify-center gap-4 p-4'>
                <TouchableOpacity
                    disabled={isRecording}
                    onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
                    className={cn(circleButton, isRecording && "opacity-40")}
                >
                    <Text className='text-white font-bold'>전환</Text>
                </TouchableOpacity>

                {/* 녹화 시작 / 중지 */}
                <TouchableOpacity
                    disabled={!isCameraReady}
                    onPress={isRecording ? stopRecording : startRecording}
                    className="w-20 h-20 rounded-full border-4 border-white justify-center items-center"
                >
                    <View
                        className={cn(
                            "bg-red-500", isRecording ? "w-[30px] h-[30px] rounded-md" : "w-[60px] h-[60px] rounded-full"
                        )}
                    >
                    </View>
                </TouchableOpacity>

                {/* 마지막 촬용 영상 다시보기 */}
                <TouchableOpacity
                    disabled={!videoUri || isRecording}
                    onPress={() => setMode("preview")}
                    className={cn(circleButton, (!videoUri || isRecording) && "opacity-40")}
                >
                    <Text className='text-white font-bold'>보기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}