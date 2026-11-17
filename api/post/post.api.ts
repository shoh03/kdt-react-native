import { Post } from "../../type/post.type"

export const fetchPostsApi = async (): Promise<Post[]> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    if(!response.ok) throw new Error("데이터를 불러오지 못했습니다.")
    const datas = await response.json()
    return datas
}

export const fetchPostsInfiniteApi = async (pageParam: number = 1): Promise<Post[]> => {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`
    )
    if(!response.ok) throw new Error("데이터를 불러오지 못했습니다.")
    const datas = await response.json()
    return datas
}