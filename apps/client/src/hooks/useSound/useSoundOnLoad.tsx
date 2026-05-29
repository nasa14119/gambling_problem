import { useEffect, useState } from 'react'
import { useSound } from './index'
import type { AudioOptions } from './index'

export const useSoundOnLoad = (path: string, options?: AudioOptions) => {
  const [ref, isReady] = useSound(path, options)
  const [havePlayed, setHavePlayed] = useState(false)
  useEffect(() => {
    if (!isReady || !ref) return
    const handePlay = () => {
      if (havePlayed) return
      setHavePlayed(true)
      ref.play()
    }
    const waitEvent = () => {
      window.addEventListener('click', handePlay, { once: true })
      window.addEventListener('pointerdown', handePlay, { once: true })
      window.addEventListener('keydown', handePlay, { once: true })
    }
    ref.play().catch(() => waitEvent())
    return () => {
      window.removeEventListener('click', handePlay)
      window.removeEventListener('pointerdown', handePlay)
      window.removeEventListener('keydown', handePlay)
    }
  }, [ref, isReady])
  return havePlayed
}
