import { PayBtn } from '#/components/Bank/PayBtn'
import { Rank } from '#/components/Bank/Rank'
import { usePayPercent, useRoundsLeft } from '#/components/Bank/store'
import { cn } from '#/lib/utils'

export function Pay() {
  const total_pay = usePayPercent()
  const rounds = useRoundsLeft()
  return (
    <div className="grid grid-rows-1 grid-cols-2 gap-x-10 h-[11vh]">
      <main className="rounded-xl px-2 border-2 border-current border-dashed grid grid-cols-1 grid-rows-2">
        <header className="flex justify-start items-center gap-x-10 mt-5">
          <h3 className="text-3xl font-medium leading-3.75 align-bottom">
            Credit Due Date
          </h3>
          <div>
            <span
              className={cn(
                'rounded-full border-2 border-current border-dashed  font-bold p-1 text-[16px] align-bottom',
                rounds <= 10 && 'text-red-700',
              )}
            >
              <span className="text-white">{rounds}</span>
            </span>
          </div>
          <PayBtn />
        </header>
        <div className=" flex items-center justify-center h-full">
          <span className="h-[3vh] w-full border-2 border-white border-dashed relative rounded-4xl">
            <span
              style={{ width: `${total_pay}%` }}
              className={cn(
                'absolute top-0 left-0 h-full rounded-4xl border-2 border-current border-dashed transition-all duration-125 ease overflow-hidden',
                total_pay < 30 && 'text-red-700 bg-red-900/10',
              )}
            ></span>
          </span>
        </div>
      </main>
      <Rank />
    </div>
  )
}
