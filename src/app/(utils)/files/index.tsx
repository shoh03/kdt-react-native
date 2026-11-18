import { cn } from '@/lib/utils';
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function index() {
    const [statusMessage, setStatusMessage] = useState<string>("내용을 입력 또는 저장하는 버튼을 누르세요.")
    const [inputText, setInputText] = useState<string>("");
    const [fileContent, setFileContent] = useState<string>("");

    // 문서 디렉토리
    const file = new File(Paths.document, "my_note.txt")

    const buttonStyle = "m-4 p-3 bg-blue-500 rounded-lg"
    const textStyle = "flex justify-center text-white"

    // 1. 사용자가 입력한 내용을 파일로 쓰기 
    const writeFile = async () => {
        try {
            // ealry return
            if(!inputText.trim()){
                setStatusMessage("저장할 텍스트를 입력해주세요.")
                return;
            }

            // 파일이 없으면
            if(!file.exists){
                file.create()
            }

            await file.write(inputText)

            // 공용 파일에 저장
            const isAvailable = await Sharing.isAvailableAsync()

            if(isAvailable) {
                await Sharing.shareAsync(file.uri, {
                    dialogTitle: "공용 폴더 파일 저장",
                    mimeType: Platform.OS === 'android' ? 'application/octet-stream' : 'text/plain',
                    UTI: "public.plain-text" // IOS 호환 설정
                })
                setStatusMessage("입력한 내용 저장이 완료되었습니다")
                setInputText("")
            }else {
                setStatusMessage("해당 기기에서는 파일 저장이 어렵습니다.")
                setInputText("")
            }

        } catch (error) {
            setStatusMessage("파일 쓰기 중 오류 발생")            
        }
    }

    // 2. 저장된 파일 읽어오기
    const readFile = async () => {
        try {
            if(!file.exists){
                setStatusMessage("저장된 파일이 없습니다")
                setFileContent("")
                return;
            }

            const content = await file.text()
            setFileContent(content)
            setStatusMessage("파일을 성공적으로 읽어왔습니다.")
        } catch (error) {
            setStatusMessage("파일 읽기 중 오류 발생")
        }
    }

    // 3. 파일 공유하기
    const shareFile = async () => {
        try {
            if(!file.exists){
                setStatusMessage("저장된 파일이 없습니다")
                setFileContent("")
                return;
            }

             // 공용 파일에 저장
            const isAvailable = await Sharing.isAvailableAsync()

            if(isAvailable) {
                await Sharing.shareAsync(file.uri, {
                    dialogTitle: "공용 폴더 파일 저장",
                    mimeType: Platform.OS === 'android' ? 'application/octet-stream' : 'text/plain',
                    UTI: "public.plain-text" // IOS 호환 설정
                })
                setStatusMessage("입력한 내용 저장이 완료되었습니다")
                setInputText("")
            }else {
                setStatusMessage("해당 기기에서는 파일 저장이 어렵습니다.")
                setInputText("")
            }

        } catch (error) {
            
        }
    }

    // 4. 기기 내 다른 파일(문서)골라서 앱으로 가져오기
    const pickExternalFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*", //text/plain
                copyToCacheDirectory: true // 앱이 읽을 수 있도록 캐시 사용 여부
            })
            
            if(!result.canceled && result.assets && result.assets.length > 0){
                const selectedFile = result.assets[0]
                const importedFile = new File(selectedFile.uri)
                // api 호출
                const content = await importedFile.text()
                setFileContent(content)
                setStatusMessage("성공적으로 외부파일을 읽어왔습니다.")
            } else {
                setStatusMessage("파일 선택이 취소되었습니다.")
            }
            
        } catch (error) {
            setStatusMessage("파일을 가져오는 중 오류가 발생했습니다.")
        }
    }

    return (
        <ScrollView>
            <View>
                <Text>{statusMessage}</Text>
            </View>
            <View>
                <TextInput 
                    className='border border-gray-300 p-4 text-[16px] mb-4'
                    multiline
                    placeholder='파일에 저장할 내용을 입력하세요.'
                    value={inputText}
                    onChangeText={setInputText}
                />
            </View>
            <View>
                <TouchableOpacity
                    onPress={writeFile}
                    className={cn(buttonStyle)}
                >
                    <Text className={cn(textStyle)}>입력된 내용으로 파일 저장</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={readFile}
                    className={cn(buttonStyle)}
                >
                    <Text className={cn(textStyle)}>저장된 파일 읽기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={pickExternalFile}
                    className={cn(buttonStyle)}
                >
                    <Text className={cn(textStyle)}>기기에서 파일 골라서 앱으로 가져오기</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>파일 읽기 결과 표시</Text>
                <Text>{fileContent}</Text>
            </View>
        </ScrollView>
    )
}