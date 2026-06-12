import { Convertion } from '#/components/Convertion'
import { useUpdateBank } from '#/components/Bank/store'
import { useEventSender } from '#/stores/eventsStore'
import { useGameState } from '#/stores/gameStore'

export function Actions() {
  const send = useEventSender()
  const { setChips, setMoney } = useUpdateBank()
  const { user } = useGameState()
  const handleChange = (key: string, value: number) => {
    if (key === 'money') {
      send({
        eventId: 'player:deposit',
        payload: {
          chips: value,
        },
      })
      setChips(value)
      return
    }
    send({
      eventId: 'player:withdraw',
      payload: {
        chips: value,
      },
    })
    setMoney(value)
  }
  return (
    <div className="h-[10vh] grid grid-cols-2 gap-x-10">
      <Convertion
        title="Frecuent transfer"
        type="money"
        onChange={handleChange}
        maxValue={user.money}
      />
      <Convertion
        title="Chips conversion"
        type="chips"
        onChange={handleChange}
        maxValue={user.chips}
      />
    </div>
  )
}
