import type { RunStats } from '@repo/types/db'
import { create } from 'zustand'

export const REFRESH_INTERVAL_SECONDS = 10
export type States = 'full' | 'players' | 'unique'

type BestRunsState = {
  loading: boolean
  error: boolean
  data: RunStats[] | null
  userData: RunStats | null
  state: States
  setState: (state: RunStats[] | null) => void
  setView: (state: States) => void
  setUserData: (state: RunStats | null) => void
  setLoading: (state: boolean) => void
  setError: (state: boolean) => void
}
export const useBestRunsStore = create<BestRunsState>((set) => ({
  loading: false,
  error: false,
  data: null,
  userData: null,
  state: 'full',
  setState: (state) => set(() => ({ data: state })),
  setUserData: (state) => set(() => ({ userData: state })),
  setLoading: (state) => set(() => ({ loading: state })),
  setError: (state) => set(() => ({ error: state })),
  setView: (state) => set(() => ({ state })),
}))

export const useBestRunsData = () => {
  return useBestRunsStore((s) => s.data)
}
export const useBestRunUserData = () => {
  return useBestRunsStore((s) => s.userData)
}
export const useChangeState = (state: States) => {
  const store = useBestRunsStore((s) => s.state)
  const setView = useBestRunsStore((s) => s.setView)
  return {
    isActive: store === state,
    setState: () => setView(state),
  }
}
