import { cn } from '#/lib/utils'
import soundEffect from '#/assets/soundEffects/boot-effect.mp3'
import { ArrowRight, Power, User2 } from 'lucide-react'
import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { useSound } from '#/hooks/useSound'

export function Hero() {
  const [isKeydown, setIsKeydown] = useState(false)
  const [ref, isReady] = useSound(soundEffect, { volume: 0.8 })
  useEffect(() => {
    if (!isReady) return
    const handleClick = () => {
      if (isKeydown) return
      setIsKeydown(true)
      ref.play()
    }
    window.addEventListener('keydown', handleClick, { once: true })
    window.addEventListener('click', handleClick, { once: true })
  }, [isReady])
  return (
    <header
      className={cn('w-screen h-screen relative z-0', styles['hero'])}
      data-keydown={isKeydown}
    >
      {isKeydown && <div className={styles['background']} />}
      {!isKeydown && (
        <span className="text-7xl absolute top-1/2 left-1/2 -translate-1/2 text-white">
          press any key to start
        </span>
      )}
      <div
        className={cn(
          'size-full flex flex-col gap-y-5 justify-center',
          styles['hero-content'],
        )}
        data-keydown={isKeydown}
      >
        <div className="grid place-content-center">
          <User2 className="size-[25vh] text-current p-5 bg-current/20 rounded-full" />
        </div>
        <div>
          <h1 className="text-center text-6xl font-bold">Gambling Problem</h1>
        </div>
        <div className="h-[5vh] w-[20vw] grid grid-cols-[1fr_min-content] mx-auto ">
          <p className="text-xl pl-2 border border-slate-800 border-r-0 flex items-center size-full bg-slate-100">
            5tart_new_game#$
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className="bg-slate-300 aspect-12/9 border border-slate-800 grid place-content-center"
                href="/game"
              >
                <ArrowRight className="size-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent className="text-current">
              <span className="text-white">Start game as guest</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 inset-x-0 flex justify-between pb-2 px-5">
        <div className={cn('flex items-end', styles['selector-left'])}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-3xl px-2 hover:bg-slate-950/10 py-2 transition-all duration-250 ease rounded-sm">
                <div>Other Account</div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-slate-950">
              <span className="text-white">Login</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-x-2 items-center">
          <Power
            className={cn(
              'size-12 text-red-500 transition-all duration-1000 ease',
              isKeydown && 'opacity-10 text-black',
            )}
          />
        </div>
      </div>
    </header>
  )
}
