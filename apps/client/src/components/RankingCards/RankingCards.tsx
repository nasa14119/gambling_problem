import { cn } from '#/lib/utils.ts'
import type { PropsWithChildren } from 'react'
import { useRankCardsTrigger, useRankCardsValue } from './store.ts'
import { RankingCardsContent } from '#/components/RankingCards/RankingCardsContent.tsx'
import { RankingCardsContainer } from '#/components/RankingCards/RankingCardsContainer.tsx'

export function RankingCards({ children }: Required<PropsWithChildren>) {
  const trigger = useRankCardsTrigger()
  const state = useRankCardsValue()
  return (
    <>
      {state === 'open' && children}
      <div
        className={cn(
          'z-90 fixed inset-0',
          state !== 'open' && 'pointer-events-none hidden -z-50',
        )}
        onClick={() => trigger('close')}
      ></div>
    </>
  )
}

export function RankingCardsGame() {
  return (
    <RankingCards>
      <RankingCardsContainer>
        <RankingCardsContent />
      </RankingCardsContainer>
    </RankingCards>
  )
}
