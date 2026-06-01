import { useEventSender } from '#/stores/eventsStore'
import { create } from 'zustand'

type Store = {
  isPaused: boolean
  changeState: (pause: boolean) => void
}
const usePauseStore = create<Store>((set) => ({
  isPaused: false,
  changeState: (param) => set({ isPaused: param }),
}))

export const usePause = () => {
  const { changeState } = usePauseStore()
  const sendEvent = useEventSender()
  const pause = () => {
    sendEvent({ eventId: 'pause', payload: undefined })
    changeState(true)
  }
  return pause
}
export const useResume = () => {
  const { changeState } = usePauseStore()
  const sendEvent = useEventSender()
  const resume = () => {
    sendEvent({ eventId: 'resume', payload: undefined })
    changeState(false)
  }
  return resume
}
export const usePauseState = () => usePauseStore((s) => s.isPaused)
