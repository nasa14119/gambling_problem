import { PlayerCardUI } from '#/components/PlayerCardUI'
import { usePlayerEvents } from '#/hooks/usePlayerEvents'

type Props = {
  playerId: string
}
export function PlayerManager({ playerId }: Props) {
  const params = usePlayerEvents(playerId)
  return <PlayerCardUI {...params} playerId={playerId} />
}
