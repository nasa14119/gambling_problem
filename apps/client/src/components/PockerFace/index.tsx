import { Title } from './Title'
import { cn } from '#/lib/utils'
import { usePockerFace, usePockerFaceTrigger } from './store'
import styles from './styles.module.css'

export { PockerTrigger } from './PockerTrigger'
export { usePockerFaceTrigger } from './store'

export function PockerFace() {
  const state = usePockerFace((s) => s.state)
  const trigger = usePockerFaceTrigger()
  return (
    <>
      <div
        className={cn(
          'fixed bottom-[10vh] left-[1vw] aspect-video h-[40vh]  rounded-4xl overflow-hidden z-50 grid grid-cols-1 grid-rows-[max-content_1fr] bg-gray-800',
          styles.main,
        )}
        data-state={state}
      >
        <div
          className={cn(
            'flex gap-x-2 h-10 px-5 items-center justify-end bg-gray-900',
            state === 'close' && 'pointer-events-none',
          )}
        >
          <span className="aspect-square bg-red-700 rounded-full w-2"></span>
          <span className="aspect-square bg-yellow-700 rounded-full w-2"></span>
          <span className="aspect-square bg-green-700 rounded-full w-2"></span>
        </div>
        <div className="min-w-full max-h-full overflow-y-scroll min-h-full bg-gray-800 font-mono">
          <Title />
        </div>
      </div>
      <div
        className={cn(
          'z-40 fixed inset-0',
          state === 'close' && 'hidden',
          state === 'idle' && 'hidden',
        )}
        onClick={() => trigger('close')}
      ></div>
    </>
  )
}
