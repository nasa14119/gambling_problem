import { useGameState } from '#/stores/gameStore'
import { useMemo } from 'react'

export const useIsActive = (id: string) => {
  const { turn = null } = useGameState()
  const memo = useMemo(() => turn !== null && turn.currentPlayer === id, [turn])
  return memo
}
