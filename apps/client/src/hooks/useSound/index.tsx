import { useEffect, useRef, useState } from 'react'

type Options = {
  volume: number
}
const DEFAULT_OPTIONS: Options = {
  volume: 0.5,
}
export type AudioOptions = Partial<Options>
export const useSound = (
  path: string,
  options: AudioOptions = {},
): [null, false] | [HTMLAudioElement, true] => {
  const { volume } = { ...DEFAULT_OPTIONS, ...options }
  const [isReady, setIsReady] = useState(false)
  const ref = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    ref.current = new Audio(path)
    ref.current.volume = volume
    ref.current.oncanplaythrough = () => setIsReady(true)
  }, [])
  if (!ref.current || !isReady) return [null, false]
  return [ref.current, isReady]
}
