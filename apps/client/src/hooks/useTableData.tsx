import { useEventListener } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { Card } from '@repo/types'
import { useEffect } from 'react'

type Table = null | (Card | null)[]
export const useTableData = (): Table => {
  const setState = useGameUpdate()
  const { table: tableStore } = useGameState()
  const event = useEventListener()
  const setTable = (table: Table) => setState({ table })
  useEffect(() => {
    if (!event) return
    const { eventId, payload } = event
    if (eventId === 'deck:flop') {
      setTable([...payload, null, null])
    }
    if (eventId === 'deck:turn') {
      setTable([...payload, null])
    }
    if (eventId === 'deck:river') {
      setTable([...payload, null])
    }
    if (eventId === 'round:start') {
      setTable(null)
    }
  }, [event])
  return tableStore
}
