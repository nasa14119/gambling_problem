import { cn } from '#/lib/utils'
import { useRef } from 'react'
import type { ComponentProps } from 'react'

type Props = {
  text: string
  className?: string
  duration?: number
  onEnd?: () => void
} & ComponentProps<'div'>
export function Row({ text, className, duration = 1, onEnd, ...rest }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  const handleAnimation = () => {
    if (!ref.current) return
    ref.current.classList.remove('typewriter-text')
    onEnd?.()
  }
  return (
    <div className="flex justify-start" {...rest}>
      <span
        className={cn('typewriter-text text-4xl', className)}
        style={{ '--duration': `${duration}s` } as any}
        ref={ref}
        onAnimationEnd={handleAnimation}
      >
        {text}
      </span>
    </div>
  )
}
