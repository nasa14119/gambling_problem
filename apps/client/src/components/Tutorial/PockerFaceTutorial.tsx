import { PockerFaceComponent } from '#/components/PockerFace/PockerFaceComponent'

import type { PockerFaceComponentProps } from '#/components/PockerFace/PockerFaceComponent'
import type { ExploitId } from '@repo/types'
import type { ItemsPockerFace, PockerFaceState } from '@repo/types/client'

export type TriggerPockerFace = PockerFaceComponentProps['trigger']

type Props = {
  state: PockerFaceState
  trigger: PockerFaceComponentProps['trigger']
  isActive: boolean
  onClick: () => void
}
export function PockerFaceTutorial({
  state,
  trigger,
  isActive,
  onClick,
}: Props) {
  const exploitExample: ItemsPockerFace = {
    description: 'Here you will click to use the exploit you whant',
    exploitId: 'example' as ExploitId,
    isAvailable: true,
    name: 'This An example of exploit',
    price: 0,
    type: 'common',
  }
  const disabled: ItemsPockerFace = {
    description: "This exploit is disable so you can't buy it at the moment",
    exploitId: 'disable' as ExploitId,
    isAvailable: false,
    name: 'Disables exploit',
    price: 0,
    type: 'common',
  }
  const see_flop: ItemsPockerFace = {
    description: 'See the next 3 cards',
    exploitId: 'see_flop',
    isAvailable: true,
    name: 'See Flop',
    price: 100,
    type: 'common',
  }
  return (
    <PockerFaceComponent
      trigger={trigger}
      handleSend={() => {
        isActive && onClick()
      }}
      items={[exploitExample, !isActive ? disabled : see_flop]}
      state={state}
      money={200}
    />
  )
}
