import { TableRuns } from '#/components/AdminView/TableRuns'
import type { RunsMetadataAdmin } from '@repo/types/db'

type Props = {
  data: RunsMetadataAdmin[]
}
export function RunsMetadata({ data }: Props) {
  return (
    <div className="size-full p-5 pb-[5vh] max-h-full overflow-y-scroll">
      <TableRuns data={data} />
    </div>
  )
}
