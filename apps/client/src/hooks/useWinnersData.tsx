import { useEventListener } from '#/stores/eventsStore'
import type { WinnersPayload } from '@repo/types'
import { useEffect, useState } from 'react'

export const useWinnersData = (): WinnersPayload => {
  const [payload, setPayload] = useState<WinnersPayload>(null)
  const data = useEventListener()
  useEffect(() => {
    if (!data) return
    const { eventId, payload: eventPayload } = data
    if (eventId === 'round:winners') {
      setPayload(eventPayload)
    }
    if (eventId === 'round:start') {
      setPayload(null)
    }
  }, [data])
  return payload
}
