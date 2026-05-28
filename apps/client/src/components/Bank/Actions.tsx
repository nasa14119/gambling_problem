import { Convertion } from '#/components/Bank/Convertion'
import { useUpdateBank } from '#/components/Bank/store'
import { useEventSender } from '#/stores/eventsStore'

export function Actions() {
  const send = useEventSender()
  const { setChips, setMoney } = useUpdateBank()
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
      />
      <Convertion
        title="Chips conversion"
        type="chips"
        onChange={handleChange}
      />
    </div>
  )
}
