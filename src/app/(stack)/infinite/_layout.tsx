import { Stack } from 'expo-router'

export default function SubStackLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {backgroundColor: "#000000"},
                headerTintColor: "#fff",
                headerTitleStyle:{
                    fontWeight: "bold"
                }
            }}
            // 스택의 구성
        >
            <Stack.Screen name='index' options={{title: "게시글 목록"}} />
            <Stack.Screen name='[id]/index' options={{title: '상세페이지'}} />
        </Stack>
    )
}