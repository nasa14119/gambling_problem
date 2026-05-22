import { useGameStore } from '#/stores/gameStore'
import type { GameState } from '@repo/types'
import { useEffect } from 'react'

const OPTIONS = {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
} as const
const createGame = async () => {
  const res = await fetch(
    'http://localhost:3000/api/game/new/singlePlayer',
    OPTIONS,
  )
  if (res.status !== 200) {
    throw new Error('Something went wrong')
  }
  const stateRes = await fetch('http://localhost:3000/api/game/status', {
    credentials: 'include',
  })
  if (stateRes.status !== 200) {
    throw new Error('Something went wrong')
  }
  const data = await stateRes.json()
  return data
}
const getStatus = async (): Promise<GameState> => {
  const res = await fetch('http://localhost:3000/api/game/status', {
    credentials: 'include',
  })
  if (res.status === 204 || res.status === 404) {
    return await createGame()
  }
  const data = await res.json()
  return data
}
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
        const data = await getStatus()
        setState({ gameState: data })
      } catch (e) {
        console.error(e)
        setState({ error: true, gameState: null })
      } finally {
        setState({ isLoading: false })
      }
    }
    fetchData()
  }, [])
}
