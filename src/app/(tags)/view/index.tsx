import { Text, View } from 'react-native'

export default function index() {
    return (
        <View className='flex flex-col flex-1'>
            <Text className='text-7.5'>리액트 네이티브에서는 HTML의 개념이 없다.</Text>
            <Text className='tesx-7.5'>p, span, h1 태그 등의 역할은 모두 <Text className='text-blue-500 font-bold text-7.5'>텍스트 태그</Text>가 수행합니다</Text>
            <Text className='tesx-7.5'>또한 View는 Div태그의 역할을 수행합니다.</Text>
        </View>
    )
}