import { Table } from '#/components/Table'
import { cn } from '#/lib/utils'
import type { Card } from '@repo/types'

export function RankingCardsContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'size-full grid grid-cols-2 font-pixelated bg-slate-100 p-1 gap-2',
        className,
      )}
    >
      <Row
        cards={['Th', 'Jh', 'Qh', 'Kh', 'Ah']}
        rank="Royal Flush"
        color="#e6be37"
      />
      <Row
        cards={['6d', '7d', '8d', '9d', 'Td']}
        rank="Straight Flush"
        color="#49009b"
      />
      <Row
        cards={['9s', '9h', '9d', '9c', 'Ah']}
        rank="Four of a kind"
        color="#5d009c"
      />
      <Row
        cards={['As', 'Ah', 'Ad', 'Ks', 'Kh']}
        rank="Full House"
        color="#7c7b75"
      />
      <Row
        cards={['3s', '8s', '6s', 'Ks', 'Ts']}
        rank="Flush"
        color="#7f7d82"
      />
      <Row
        cards={['7c', '8h', '9d', 'Th', 'Js']}
        rank="Straight"
        color="#a5a4a7"
      />
      <Row cards={['Ac', 'Ah', 'Ad']} rank="Three of a kind" color="#a75843" />
      <Row cards={['Ac', 'Ah', 'Kc', 'Kh']} rank="Two Pair" color="#965841" />
      <Row cards={['Ac', 'Ah']} rank="One Pair" color="#735743" />
      <Row cards={['Ac']} rank="High Card" color="#615742" />
    </div>
  )
}

function Row({
  cards,
  rank,
  className,
  color,
}: {
  cards: Card[]
  rank: string
  className?: string
  color?: string
}) {
  const table = Array.from({ length: 5 }).map(
    (_: any, i: number) => cards[i] ?? null,
  )
  return (
    <div className="flex gap-x-2 text-xl items-center">
      <Table table={table} next={false} scale={0.5} />
      <span className={cn('w-full text-left', className)} style={{ color }}>
        {rank}
      </span>
    </div>
  )
}
