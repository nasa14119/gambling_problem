import { Empty } from '#/components/Leaderboard/Empty'
import {
  useBestRunsData,
  useBestRunsSetup,
} from '#/components/Leaderboard/TableBest/store'
import { TableBestUI } from './TableBestUI.tsx'

export function TableBest() {
  useBestRunsSetup()
  const data = useBestRunsData()
  return (
    <>
      {data && <TableBestUI data={data} />}
      {data === null && <Empty />}
    </>
  )
}
