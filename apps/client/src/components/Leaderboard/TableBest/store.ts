import { fetchBestRuns } from '#/lib/fetch'
import type { RunStats } from '@repo/types/db'
import { useEffect } from 'react'
import { create } from 'zustand'

const REFRESH_INTERVAL_SECONDS = 10

type BestRunsState = {
  loading: boolean
  error: boolean
  data: RunStats[] | null
  userData: RunStats | null
  setState: (state: RunStats[] | null) => void
  setUserData: (state: RunStats | null) => void
  setLoading: (state: boolean) => void
  setError: (state: boolean) => void
}
const useBestRunsStore = create<BestRunsState>((set) => ({
  loading: false,
  error: false,
  data: null,
  userData: null,
  setState: (state) => set(() => ({ data: state })),
  setUserData: (state) => set(() => ({ userData: state })),
  setLoading: (state) => set(() => ({ loading: state })),
  setError: (state) => set(() => ({ error: state })),
}))

export const useBestRunsSetup = () => {
  const setState = useBestRunsStore((s) => s.setState)
  const setUserData = useBestRunsStore((s) => s.setUserData)
  const setLoading = useBestRunsStore((s) => s.setLoading)
  const setError = useBestRunsStore((s) => s.setError)

  useEffect(() => {
    const fetchData = async () => {
      const timeout = setTimeout(() => setLoading(true), 100)
      try {
        const { runs, user = null } = await fetchBestRuns()
        setUserData(user)
        setState(runs)
        setError(false)
      } catch (e) {
        console.error(e)
        setError(true)
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL_SECONDS * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])
}
export const useBestRunsData = () => {
  return useBestRunsStore((s) => s.data)
}
