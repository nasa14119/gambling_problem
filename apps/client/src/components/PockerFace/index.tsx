import { usePockerFace, usePockerFaceTrigger } from './store'
import { usePockerFaceItems as useStore } from './hooks/useGamePockerFaceItems'
import { useExploitSocketLoading } from '#/exploits/store'
import { PockerFaceComponent } from '#/components/PockerFace/PockerFaceComponent'
import { useGameState } from '#/stores/gameStore'

export { PockerTrigger } from './PockerTrigger'
export { usePockerFaceTrigger } from './store'

export function PockerFace() {
  const isLoading = useExploitSocketLoading()
  if (isLoading) return null
  return <PockerFaceWithStore />
}
function PockerFaceWithStore() {
  const state = usePockerFace((s) => s.state)
  const trigger = usePockerFaceTrigger()
  const [items, handleSend] = useStore()
  const { user } = useGameState()
  return (
    <PockerFaceComponent
      handleSend={handleSend}
      items={items}
      state={state}
      trigger={trigger}
      money={user.money}
    />
  )
}
