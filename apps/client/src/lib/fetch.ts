import { SERVER_PATH } from '#/env'
import type { GameState } from '@repo/types'

const CREATE_OPTIONS = {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
} as const
export const fetchNewGame = async () => {
  const res = await fetch(
    `${SERVER_PATH}/api/game/new/singlePlayer`,
    CREATE_OPTIONS,
  )
  if (res.status !== 200) {
    throw new Error('Something went wrong')
  }
  const stateRes = await fetch(`${SERVER_PATH}/api/game/status`, {
    credentials: 'include',
  })
  if (stateRes.status !== 200) {
    throw new Error('Something went wrong')
  }
  const data = await stateRes.json()
  return data
}

export const fetchStatus = async (): Promise<GameState | null> => {
  const res = await fetch(`${SERVER_PATH}/api/game/status`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (res.status === 204 || res.status === 404) {
    return null
  }
  try {
    const data = await res.json()
    return data
  } catch {
    throw new Error('Error trying to format data as JSON')
  }
}
