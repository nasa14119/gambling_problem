import { Empty } from '#/components/Leaderboard/Empty'
import {
  useBestRunsData,
  useBestRunsSetup,
} from '#/components/Leaderboard/store'
import { TableBest } from '#/components/Leaderboard/TableBest'

export function MainLeaderboard() {
  useBestRunsSetup()
  const data = useBestRunsData()
  return (
    <div className="size-full p-2 grid grid-cols-1 grid-rows-[50%_50%]">
      <div>
        <h2 className="text-lg flex leading-4 mb-2 font-medium">Best Scores</h2>
        {data && <TableBest data={data} />}
        {data == null && <Empty />}
      </div>
      <div></div>
    </div>
  )
}
