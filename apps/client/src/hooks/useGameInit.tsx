import { fetchStatus } from '#/lib/fetch'
import { useGameStore } from '#/stores/gameStore'
import { useEffect } from 'react'

export const useGameInit = () => {
  const setState = useGameStore((s) => s.setState)

  useEffect(() => {
    setState({ isLoading: true })
    const localData = localStorage.getItem('gameState')
    if (localData) {
      setState({ gameState: JSON.parse(localData), isLoading: false })
    }
    const fetchData = async () => {
      try {
        const data = await fetchStatus()
        setState({ gameState: data })
      } catch (e) {
        const error = e as Error
        setState({ error: error.message, gameState: null })
      } finally {
        setState({ isLoading: false })
      }
    }
    fetchData()
  }, [])
}
