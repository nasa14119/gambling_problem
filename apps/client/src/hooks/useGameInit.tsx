import { useAuth } from '#/components/Login/store'
import { fetchStatus } from '#/lib/fetch'
import { useGameStore } from '#/stores/gameStore'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const useGameInit = () => {
  const setState = useGameStore((s) => s.setState)
  const auth = useAuth()
  const { navigate } = useRouter()
  useEffect(() => {
    setState({ isLoading: true })
    const localData = localStorage.getItem('gameState')
    if (localData) {
      setState({ gameState: JSON.parse(localData), isLoading: false })
    }
    const fetchData = async () => {
      try {
        const data = await fetchStatus()
        if (!data) {
          navigate({ to: auth.isLogged ? '/user' : '/' })
          return
        }
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
