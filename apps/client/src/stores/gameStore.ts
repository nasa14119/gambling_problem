import { create } from 'zustand'
import type { GameState } from '@repo/types'
import { useCallback } from 'react'

type UpdateGameState = (param: GameState) => GameState
type Store = {
  gameState: GameState | null
  isLoading: boolean
  setState: (param: Partial<Store>) => void
  updateGameState: (param: UpdateGameState) => void
  error: string | null
}
const setLocal = () => {
  const local = localStorage.getItem('gameState')
  if (!local) return null
  return JSON.parse(local)
}
export const useGameStore = create<Store>((set) => ({
  error: null,
  isLoading: true,
  gameState: setLocal(),
  setState: (changing) => {
    set((prev) => {
      const newState = { ...prev, ...changing }
      if (newState.gameState) {
        localStorage.setItem('gameState', JSON.stringify(newState.gameState))
      }
      return newState
    })
  },
  updateGameState: (changing) => {
    set((prev) => {
      if (!prev.gameState) return {}
      const newState = changing(prev.gameState)
      localStorage.setItem('gameState', JSON.stringify(newState))
      return { ...prev, gameState: newState }
    })
  },
}))

export const useGameState = () => {
  const gameState = useGameStore((s) => s.gameState)
  if (!gameState) throw new Error('Game state is null')
  return gameState
}

export const useGameUpdate = () => {
  const setState = useGameStore((s) => s.updateGameState)
  const updateFun = useCallback(
    (param: Partial<GameState>) => setState((prev) => ({ ...prev, ...param })),
    [setState],
  )
  return updateFun
}
