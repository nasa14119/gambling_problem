import { useEventListener } from '#/eventsStore'
import type { Card } from '@repo/types'
import { useEffect, useState } from 'react'

type Table = null | (Card | null)[]
export const useTableData = (): Table => {
  const event = useEventListener()
  const [table, setTable] = useState<Table>(null)
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
  return table
}
