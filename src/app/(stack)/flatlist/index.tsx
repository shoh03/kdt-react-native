import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

interface Post {
    id: number;
    title: string;
    body: string;
}

export default function index() {

    const [post, setPost] = useState([
        {id: 1, title: "첫 번째 게시글", body: "첫 번째 내용"},
        {id: 2, title: "두 번째 게시글", body: "두 번째 내용"},
        {id: 3, title: "세 번째 게시글", body: "세 번째 내용"},
    ])

    return (
        <View>
            <FlatList
                data={post}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}: {item: Post}) => (
                    <Pressable
                        className='
                            p-4 m-4 bg-gray-50
                            border border-gray-200
                            rounded-xl active:bg-gray-300
                        '
                        onPress={() => {
                            router.push({
                                pathname: "/flatlist/[id]",
                                params: {
                                    id: item.id,
                                    title: item.title,
                                    body: item.body
                                }
                            })
                        }}
                    >
                        <Text
                            className='text-lg font-bold text-gray-800'
                        >{item.title}</Text>
                        <Text
                            className='text-gray-500 text-sm mt-1'
                        >{item.body}</Text>
                    </Pressable>
                )}
            />
        </View>
    )
}