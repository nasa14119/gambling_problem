import { cn } from '#/lib/utils'
import type { ComponentProps, PropsWithChildren } from 'react'

type ActiveRoutes = 'casino' | 'bank'
type PropsNav = {
  current: ActiveRoutes
} & PropsWithChildren
const PATHS: Record<ActiveRoutes, string> = {
  casino: 'online.casino.com/round?id=jfldie1231',
  bank: 'loanmanager.DTJMQ&fyJv88Webh3Mm#Urm8#RfyZ1Ts&&TJzp.onion',
}
const BG = 'bg-neutral-300'
export function NavGame({ children, current }: PropsNav) {
  return (
    <nav className="flex flex-col pt-2 bg-neutral-200">
      <div className="flex gap-x-1 px-5">{children}</div>
      <div className={cn('p-2 flex items-center px-5', BG)}>
        <span className="bg-white rounded-4xl w-full px-5 italic text-sm py-1 font-light">
          https://{PATHS[current]}
        </span>
      </div>
    </nav>
  )
}
type PropsItem = {
  text: string
  isActive?: boolean
} & ComponentProps<'span'>
export function NavGameItem({ text, isActive = false, ...rest }: PropsItem) {
  return (
    <span
      className={cn(
        ' text-[14px] font-medium w-[10vw] py-1 px-[1vw] flex items-center  transition-all ease-linear duration-100 cursor-pointer',
        rest.className,
        isActive && `${BG} font-semibold`,
        'hover:' + BG,
      )}
      {...rest}
    >
      {text}
    </span>
  )
}
