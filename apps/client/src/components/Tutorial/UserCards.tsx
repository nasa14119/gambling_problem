import { PlayerCard } from '#/components/PlayerCard'
import { TooltipCustom } from '#/components/Tutorial/TultipCustom'
import { Option } from '#/components/UserInput/UserActions'
import type { PropsWithChildren } from 'react'

export function UserCards() {
  return (
    <div className="absolute flex bottom-1 justify-center items-end inset-x-0">
      <TooltipCustom text="This are your cards">
        <div>
          <PlayerCard cards={['Ks', 'As']} />
        </div>
      </TooltipCustom>
      <div className="p-2 flex flex-col justify-end text-white gap-1">
        <TooltipCustom text="This are the options that you have in your turn">
          <Option value="Turn" />
        </TooltipCustom>
        <TooltipOption text="You are puttin all your left chips at risk">
          <Option value="All in" className="bg-green-500/70" />
        </TooltipOption>
        <TooltipOption text="You will increase the amount of money players need to pay to continue in the game">
          <Option value="raise" className="bg-green-500/70" />
        </TooltipOption>
        <TooltipOption text="Pay and continue in the game">
          <Option value="pay" className="bg-blue-500/70" />
        </TooltipOption>
        <TooltipOption text="You will continue playing but the pot won't increase">
          <Option value="check" className="bg-yellow-500" />
        </TooltipOption>
        <TooltipOption text="This leves you out of the game inmidiatly">
          <Option value="Fold" className="bg-red-500/70" />
        </TooltipOption>
      </div>
    </div>
  )
}

type Props = {
  text: string
} & PropsWithChildren
function TooltipOption({ text, children }: Props) {
  return (
    <TooltipCustom text={text} side="right">
      {children}
    </TooltipCustom>
  )
}
