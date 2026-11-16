import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

export default function index() {

    const {id, title, body} = useLocalSearchParams()

    return (
        <View>
            <Pressable
                className='
                    m-4 p-3 bg-blue-500 rounded-lg
                '
                onPress={() => {router.back()}}
            >
                <Text
                    className='text-white font-bold text-base'
                >목록으로</Text>
            </Pressable>
            <Text>
                글 번호: {id}
            </Text>
            <Text>
                글 제목: {title}
            </Text>
            <Text>
                글 내용: {body}
            </Text>
        </View>
    )
}