import { SERVER_PATH } from '#/env'
import type { BestRunsQuery } from '#/types'
import type { GameState } from '@repo/types'
import type { ExploitUsedStats, RunStats } from '@repo/types/db'

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

export const fetchSaveQuit = async () => {
  const res = await fetch(`${SERVER_PATH}/api/game/save-quit`, CREATE_OPTIONS)
  if (res.status !== 204) {
    throw new Error('Something went wrong')
  }
}

export const fetchLoadGame = async () => {
  const res = await fetch(`${SERVER_PATH}/api/game/load`, {
    ...CREATE_OPTIONS,
    redirect: 'follow',
  })
  if (res.status === 204) {
    const data = await fetchNewGame()
    localStorage.setItem('gameState', JSON.stringify(data))
    return
  }
  if (res.status !== 200) {
    throw new Error(`Error loading game: ${res.status}`)
  }
}

export const fetchStats = async (url: string): Promise<BestRunsQuery> => {
  const res = await fetch(`${SERVER_PATH}/api/stats${url}`, {
    credentials: 'include',
  })
  if (res.status === 204) {
    return { runs: null, user: null }
  }
  if (res.status !== 200) {
    throw new Error(`Error loading game: ${res.status}`)
  }
  const data = await res.json()
  return data
}

export const fetchExploitsUsed = async (
  url: string,
): Promise<ExploitUsedStats[]> => {
  const res = await fetch(`${SERVER_PATH}/api/stats${url}`, {
    credentials: 'include',
  })
  if (res.status === 204) {
    return []
  }
  if (res.status !== 200) {
    throw new Error(`Error loading game: ${res.status}`)
  }
  const data = await res.json()
  return data
}
