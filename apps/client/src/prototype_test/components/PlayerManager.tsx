import { PlayerCardUI } from '#/components/PlayerCardUI'
import { usePlayerEvents } from '#/prototype_test/hooks/usePlayerEvents'
import { useSocket } from '#/prototype_test/hooks/useSocket'

type Props = {
  playerId: string
}
export function PlayerManager({ playerId }: Props) {
  const socket = useSocket({ playerId })
  const params = usePlayerEvents({ playerId, socket })
  return <PlayerCardUI {...params} playerId={playerId} />
}
