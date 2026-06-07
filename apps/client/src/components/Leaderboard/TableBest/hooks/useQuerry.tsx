import { fetchStats } from '#/lib/fetch'
import { useBestRunsQuerry } from './useBestRunQuerry'

export const useBestRuns = () => {
  return useBestRunsQuerry(() => fetchStats('/best-runs'))
}

export const useBestPlayers = () => {
  return useBestRunsQuerry(() => fetchStats('/best-players'))
}

export const useBestUnique = () => {
  return useBestRunsQuerry(() => fetchStats('/best-unique'))
}
