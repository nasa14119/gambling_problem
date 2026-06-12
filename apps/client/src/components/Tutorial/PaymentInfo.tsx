import { RoundIndicator } from '#/components/Bank/RoundIndicator'
import { Slider } from '#/components/Bank/Slider'
import { TooltipDark } from '#/components/Tutorial/TultipCustom'
import { cn } from '#/lib/utils'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  money: number
  chips: number
  pay: number
  setMoney: Dispatch<SetStateAction<number>>
  setPay: Dispatch<SetStateAction<number>>
}
export function PaymentInfo({ money, chips, pay, setMoney, setPay }: Props) {
  const rank = ((money + chips) / 2200) * 100
  const percent = pay / 1000
  const isPay = percent >= 1
  const isDisable = money <= 0
  return (
    <div className="h-1/5 w-full grid grid-cols-2 gap-x-5 text-white">
      <TooltipDark text="Here you find information about your credit with the mafia">
        <div className="border-2 border-green-600 border-dashed size-full rounded-xl p-5 text-3xl">
          {!isPay && (
            <>
              <div className="pb-2 flex gap-x-10 items-center">
                <h3 className=" text-green-500">Credit Due Date</h3>
                <TooltipDark text="This are the rounds that you can play util the mafia kills you ">
                  <div>
                    <RoundIndicator rounds={2} />
                  </div>
                </TooltipDark>
                <TooltipDark text="You press this botton to pay your dept it pays the amount read">
                  <button
                    className={cn(
                      'py-1 px-4 rounded-sm border-dashed border-2 border-white text-xs',
                      isDisable && 'opacity-50',
                    )}
                    onClick={() => {
                      setMoney((p) => p - 500)
                      setPay((p) => p + 500)
                    }}
                    disabled={isDisable}
                  >
                    Pay +500
                  </button>
                </TooltipDark>
              </div>
              <Slider color="var(--color-red-600)" percentage={percent * 100} />
            </>
          )}
          {isPay && (
            <div className="flex justify-center items-center size-full">
              You pay all your dept
            </div>
          )}
        </div>
      </TooltipDark>
      <TooltipDark text="This is your rank you will unlock exploits when you change rank level">
        <div className="border-2 border-green-600 border-dashed size-full rounded-xl p-5 text-3xl">
          <h3 className="pb-2 text-green-500">Rank</h3>
          <Slider color="var(--color-cyan-600)" percentage={rank} />
        </div>
      </TooltipDark>
    </div>
  )
}
