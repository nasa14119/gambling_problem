import { useEventSender } from '#/plaingStore'
import { useRef } from 'react'

export function InputPlayer() {
  const sendEvent = useEventSender()
  const values = useRef<{ type: string; chips: number }>({
    type: 'fold',
    chips: 0,
  })
  return (
    <div className="fixed bottom-5 left-5 flex gap-x-2">
      <select
        name=""
        id=""
        className="bg-blue-400 py-2 px-5 rounded-3xl focus:outline-0 appearance-none capitalize text-center"
        onChange={(e) => (values.current.type = e.target.value)}
      >
        <option value="fold">fold</option>
        <option value="raise">raise</option>
        <option value="pay">pay</option>
        <option value="check">check</option>
      </select>
      <input
        type="number"
        name=""
        id=""
        className="bg-blue-400 rounded-3xl w-20 text-center focus:outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={0}
        onChange={(e) => (values.current.chips = Number(e.target.value))}
      />
      <button
        className="px-4 py-2 rounded-3xl text-center bg-blue-500 disabled:bg-blue-500/30 disabled:text-white/30"
        disabled={!sendEvent}
        onClick={() => {
          if (!sendEvent) return
          sendEvent({
            eventId: 'player:input',
            payload: { type: values.current.type, chips: values.current.chips },
          })
        }}
      >
        Submit
      </button>
    </div>
  )
}
