import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { persist, combine, createJSONStorage } from "zustand/middleware"

const useCountStore = create(
    persist(
        combine(
            {
                count: 0
            },
            (set) => ({
                increase: () => set((state) => ({count: state.count + 1})),
                decrease: () => set((state) => ({count: state.count - 1}))
            })
        ),
        {
            name: "count-store",
            // AysncStorage로 연결해서 저장 후 사용
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
)

export default useCountStore;