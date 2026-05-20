import { Application } from '#/components/Applications'
import { SquareTerminal } from 'lucide-react'
import { usePockerFaceTrigger } from './store'

export function PockerTrigger() {
  const trigger = usePockerFaceTrigger()
  return (
    <Application
      Icon={SquareTerminal}
      tooltip="PockerFace"
      onClick={() => trigger()}
    />
  )
}
