import { useInfiniteQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import { fetchPostsInfiniteApi } from '../../../../api/post/post.api'

export default function index() {

    const {
        data, 
        fetchNextPage, 
        hasNextPage, // 다음페이지가 있는지 여부
        isFetchingNextPage, 
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ["posts-infinite"],
        queryFn: ({pageParam}) => fetchPostsInfiniteApi(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.length < 10) return undefined;
            return allPages.length + 1; 
        }
    })

    console.log(data)
    const posts = data?.pages.flatMap((page) => page) || []

    return (
        <FlatList
            data={posts}
            keyExtractor={(item, i) => `${item.id}-${i}`}
            renderItem={({item}) => (
                <Pressable
                    className='
                        p-4 m-4 bg-gray-50
                        border border-gray-200
                        rounded-xl active:bg-gray-300
                    '
                    onPress={() => {
                        router.push({
                            pathname: `/infinite/${item.id}` as any,
                        })
                    }}
                >
                    <Text className='font-semibold text-gray-900' numberOfLines={1}>
                        {item.id}번, {item.title}
                    </Text>
                </Pressable>
            )}

            // 무한 스크롤
            onEndReached={() => {
                if(hasNextPage && !isFetchingNextPage){
                    fetchNextPage()
                }
            }}         
            
            // 스크롤이 30% 정도 남으면 추가 로드
            onEndReachedThreshold={0.3}

            // 바닥에 로딩바(선택)
            ListFooterComponent={
                isFetchingNextPage ? (
                    <View>
                        <ActivityIndicator size={'small'} />
                    </View>
                ) : undefined
            }

        />
    )
}