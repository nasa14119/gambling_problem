import { cn } from '#/lib/utils'
import soundEffect from '#/assets/soundEffects/boot-effect.mp3'
import { ArrowRight, Power, User2 } from 'lucide-react'
import styles from './styles.module.css'
import { useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shadcn/ui/tooltip'
import { useSound } from '#/hooks/useSound'
import { Link, useRouter } from '@tanstack/react-router'
import { NavBar } from '#/components/Nav/NavBar'
import { fetchStatus } from '#/lib/fetch'

export function Hero() {
  const [isKeydown, setIsKeydown] = useState(false)
  const havePlay = useRef(false)
  const [ref, isReady] = useSound(soundEffect, { volume: 0.8 })
  const { navigate } = useRouter()
  useEffect(() => {
    if (!isReady) return
    const handleClick = () => {
      if (havePlay.current) return
      havePlay.current = true
      setIsKeydown(true)
      ref.play()
    }
    window.addEventListener('keydown', handleClick, { once: true })
    window.addEventListener('click', handleClick, { once: true })
  }, [isReady])
  const handleStart = async () => {
    const data = await fetchStatus()
    localStorage.setItem('gameState', JSON.stringify(data))
    if (data === null) {
      navigate({ to: '/login' })
      return
    }
    navigate({ to: '/game' })
  }
  return (
    <header
      className={cn('w-screen h-screen relative z-0', styles['hero'])}
      data-keydown={isKeydown}
    >
      <NavBar
        className={cn('fixed top-0 inset-x-0 bg-[#f2f2f2]', styles['hero-nav'])}
      />
      {isKeydown && <div className={styles['background']} />}
      {!isKeydown && (
        <span className="text-7xl absolute top-1/2 text-nowrap left-1/2 -translate-1/2 text-white">
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
          <h1 className="text-center text-8xl font-bold leading-20">
            Gambling Problem
          </h1>
        </div>
        <div>
          <Link
            to="/landing"
            className="h-[5vh] w-[20vw] flex justify-between mx-auto mb-2 border border-slate-800 bg-slate-100 transition-colors duration-700 hover:bg-blue-100 relative group overflow-hidden"
          >
            <span className="text-xl pl-2 flex items-center h-full absolute transition-all duration-500 left-1/2 -translate-x-1/2 group-hover:left-0 group-hover:translate-x-0 text-blue-900 group-hover:opacity-80 group-hover:*:opacity-100 font-medium">
              Landing
            </span>
            <div className="aspect-square h-full flex items-center text-blue-900 absolute right-0 top-0">
              <ArrowRight className="size-5 translate-x-[200%] transition-transform duration-500 group-hover:translate-x-0" />
            </div>
          </Link>
          <div className="h-[5vh] w-[20vw] grid grid-cols-[1fr_min-content] mx-auto">
            <p className="text-xl pl-2 border border-slate-800 border-r-0 flex items-center size-full bg-slate-100">
              5tart_new_game#$
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleStart}
                  className="bg-slate-300 aspect-12/9 border border-slate-800 grid place-content-center"
                >
                  <ArrowRight className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-current">
                <span className="text-white">Start game</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 inset-x-0 flex justify-between pb-2 px-5">
        <div className={cn('flex items-end', styles['selector-left'])}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/login"
                className="text-3xl px-2 hover:bg-slate-950/10 py-2 transition-all duration-250 ease rounded-sm"
              >
                <div>Other Account</div>
              </Link>
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
