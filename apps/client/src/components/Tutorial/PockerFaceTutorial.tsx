import { PockerFaceComponent } from '#/components/PockerFace/PockerFaceComponent'

import type { PockerFaceComponentProps } from '#/components/PockerFace/PockerFaceComponent'
import type { ExploitId } from '@repo/types'
import type { ItemsPockerFace, PockerFaceState } from '@repo/types/client'

export type TriggerPockerFace = PockerFaceComponentProps['trigger']

type Props = {
  state: PockerFaceState
  trigger: PockerFaceComponentProps['trigger']
}
export function PockerFaceTutorial({ state, trigger }: Props) {
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
  return (
    <PockerFaceComponent
      trigger={trigger}
      handleSend={() => {}}
      items={[exploitExample, disabled]}
      state={state}
    />
  )
}
