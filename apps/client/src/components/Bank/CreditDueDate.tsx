import { RoundIndicator } from '#/components/Bank/RoundIndicator'
import { Slider } from '#/components/Bank/Slider'
import type { PropsWithChildren } from 'react'

type Props = {
  total_pay: number
  rounds: number
} & PropsWithChildren

export function CreditDueDate({ total_pay, rounds, children }: Props) {
  return (
    <main className="rounded-xl px-2 border-2 border-current border-dashed flex flex-col size-full">
      <header className="flex justify-start items-center gap-x-10 mt-5">
        {total_pay === 100 ? (
          <>
            <span className="text-center text-3xl flex justify-start items-center size-full">
              You have paid all your debt
            </span>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-medium leading-3.75 align-bottom">
              Credit Due Date
            </h3>
            <RoundIndicator rounds={rounds} />
            {children}
          </>
        )}
      </header>
      {/* This is the actual slider of information */}
      {total_pay !== 100 && (
        <div className=" flex items-center justify-center h-full">
          <Slider color="var(--color-red-500)" percentage={total_pay} />
        </div>
      )}
    </main>
  )
}
