import {
  REFRESH_INTERVAL_SECONDS,
  useBestRunsStore,
} from '#/components/Leaderboard/TableBest/store'
import type { BestRunsQuery } from '@repo/types/client'
import { useEffect } from 'react'

export const useBestRunsQuerry = (querry: () => Promise<BestRunsQuery>) => {
  const setState = useBestRunsStore((s) => s.setState)
  const setUserData = useBestRunsStore((s) => s.setUserData)
  const setLoading = useBestRunsStore((s) => s.setLoading)
  const setError = useBestRunsStore((s) => s.setError)

  useEffect(() => {
    const fetchData = async () => {
      const timeout = setTimeout(() => setLoading(true), 100)
      try {
        const { runs, user = null } = await querry()
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
