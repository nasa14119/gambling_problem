import {
  useBestRunsData,
  useBestRunsStore,
} from '#/components/Leaderboard/TableBest/store'
import { useBestPlayers, useBestRuns, useBestUnique } from './hooks/useQuerry'
import { TableBestUI } from './components/TableBestUI.tsx'

export function TableBest() {
  const state = useBestRunsStore((s) => s.state)
  return (
    <>
      {state === 'full' && <TableBestRuns />}
      {state === 'players' && <TablePlayers />}
      {state === 'unique' && <TableUnique />}
    </>
  )
}

function TablePlayers() {
  useBestPlayers()
  const data = useBestRunsData()
  return <TableBestUI data={data} />
}
function TableBestRuns() {
  useBestRuns()
  const data = useBestRunsData()
  return <TableBestUI data={data} />
}
function TableUnique() {
  useBestUnique()
  const data = useBestRunsData()
  return <TableBestUI data={data} />
}
