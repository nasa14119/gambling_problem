import { Title } from './Title'
import { cn } from '#/lib/utils'
import { usePockerFace, usePockerFaceTrigger } from './store'
import styles from './styles.module.css'
import { usePockerFaceItems as useStore } from './hooks/useGamePockerFaceItems'
import { Item } from '#/components/PockerFace/Item'
import { useExploitSocketLoading } from '#/exploits/store'

export { PockerTrigger } from './PockerTrigger'
export { usePockerFaceTrigger } from './store'

export function PockerFace() {
  const isLoading = useExploitSocketLoading()
  if (isLoading) return null
  return <PockerFaceComponent />
}
function PockerFaceComponent() {
  const state = usePockerFace((s) => s.state)
  const trigger = usePockerFaceTrigger()
  const [items, handleSend] = useStore()
  return (
    <>
      <div
        className={cn(
          'fixed bottom-[10vh] z-100 left-[1vw] aspect-video h-[40vh]  rounded-4xl overflow-hidden grid grid-cols-1 grid-rows-[max-content_1fr] bg-gray-800',
          styles.main,
          state !== 'open' && 'pointer-events-none -z-50',
        )}
        onMouseOver={() =>
          state !== 'close' && (document.body.style.overflow = 'hidden')
        }
        onMouseLeave={() =>
          state !== 'close' && (document.body.style.overflow = 'hidden')
        }
        data-state={state}
      >
        <div
          className={cn(
            'flex gap-x-2 h-10 px-5 items-center justify-end bg-gray-900',
          )}
          onClick={() => trigger('close')}
        >
          <span className="aspect-square bg-red-700 rounded-full w-2"></span>
          <span className="aspect-square bg-yellow-700 rounded-full w-2"></span>
          <span className="aspect-square bg-green-700 rounded-full w-2"></span>
        </div>
        <div className="min-w-full max-h-full overflow-y-scroll min-h-full bg-gray-950 text-cyan-400 scrollbar-track-transparent px-2">
          <Title />
          {items.map((exploit) => (
            <Item
              key={exploit}
              id={exploit}
              desc="hola"
              title={exploit}
              onClick={() => handleSend(exploit)}
              className="text-green-400"
            />
          ))}
        </div>
      </div>
      <div
        className={cn(
          'z-90 fixed inset-0',
          state !== 'open' && 'pointer-events-none hidden -z-50',
        )}
        onClick={() => trigger('close')}
      ></div>
    </>
  )
}
