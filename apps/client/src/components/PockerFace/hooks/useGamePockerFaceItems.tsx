import { usePockerFace } from '#/components/PockerFace/store'
import { SERVER_PATH } from '#/env'
import {
  useExploitEventListener,
  useExploitEventSender,
} from '#/exploits/store'
import { sleepClient } from '#/lib/utils'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { ExploitId } from '@repo/types'
import type { ExploitData } from '@repo/types/db'
import { useEffect, useState } from 'react'

const fetchStore = async (rtry: number = 1000) => {
  const res = await fetch(`${SERVER_PATH}/api/game/status/store`, {
    credentials: 'include',
  })
  if (res.status !== 200) {
    await sleepClient(rtry)
    return fetchStore(rtry ** 2)
  }
  const data = await res.json()
  return data
}
type Items = ExploitData & { isAvailable: boolean }
export const usePockerFaceItems = (): [Items[], (param: ExploitId) => void] => {
  const state = usePockerFace((s) => s.state)
  const [items, setItems] = useState<Items[] | null>(null)
  const { user } = useGameState()
  const setState = useGameUpdate()
  const send = useExploitEventSender()
  const handleSend = (param: ExploitId) => {
    send({
      eventId: 'exploit:buy',
      payload: { exploitId: param, playerId: user.playerId },
    })
  }
  useExploitEventListener(({ eventId, payload }) => {
    if (eventId === 'exploit:invetory:add') {
      setItems((prev) =>
        prev
          ? prev.filter((item) => item.exploitId !== payload.exploit.exploitId)
          : null,
      )
      setState({
        user: {
          ...user,
          invetory: Array.from(new Set([...user.invetory, payload.exploit])),
        },
      })
    }
  })
  useEffect(() => {
    if (state === 'close') return
    fetchStore().then(({ store }) => setItems([...store]))
  }, [state])
  if (items === null) return [[], handleSend]
  return [items, handleSend]
}
