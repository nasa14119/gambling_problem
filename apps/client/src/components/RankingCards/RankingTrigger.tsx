import { Application } from '#/components/Applications'
import { useRankCardsTrigger } from './store'
import { NotebookPen } from 'lucide-react'

export function RankingTrigger() {
  const trigger = useRankCardsTrigger()
  return (
    <Application
      Icon={NotebookPen}
      onClick={() => trigger()}
      tooltip="See Cards Ranks"
    />
  )
}
