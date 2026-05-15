import { PlayerCardUI } from '#/components/PlayerCardUI'
import { usePlayerEvents } from '#/hooks/usePlayerEvents'
import { useSocket } from '#/hooks/useSocket'

type Props = {
  playerId: string
}
export function PlayerManager({ playerId }: Props) {
  const socket = useSocket({ playerId })
  const params = usePlayerEvents({ playerId, socket })
  return <PlayerCardUI {...params} playerId={playerId} />
}
