import gunsuhut from '#/assets/gunshut.png'
import exploitCover from '#/assets/exploitCover.png'
import { Content as DataContent } from '#/components/Summary/Content'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Row } from '#/components/Summary/Row'
import { cn } from '#/lib/utils'
import { SERVER_PATH } from '#/env'
import type { LastRun } from '@repo/types/server'

export const Route = createFileRoute('/summary')({ component: Summary })
async function getSummary(): Promise<LastRun | null> {
  const mock = new URLSearchParams(window.location.search).get('mock')
  if (mock === 'win') {
    return {
      typeEnd: 'WIN',
      moneyTotal: 5000,
      moneySpend: 1200,
      exploitsUsed: 7,
      finalScore: 3800,
    }
  }
  if (mock === 'loss') {
    return {
      typeEnd: 'DEATH',
      moneyTotal: 300,
      moneySpend: 2500,
      exploitsUsed: 11,
      finalScore: -2200,
    }
  }

  const res = await fetch(`${SERVER_PATH}/api/stats/user-last-run-summary`, {
    credentials: 'include',
  })
  if (res.status === 204) return null
  return await res.json()
}
function Summary() {
  const { navigate } = useRouter()
  const [summary, setSummary] = useState<LastRun>(null)

  useEffect(() => {
    getSummary().then((update) => {
      if (update == null) return
      setSummary(update)
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r') {
        navigate({ to: '/' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!summary) return null

  const isWin = summary.typeEnd === 'WIN'

  return (
    <div
      className={cn(
        'font-pixelated text-white bg-black fixed inset-0 grid grid-rows-1',
        isWin ? 'grid-cols-[1fr_24vw]' : 'grid-cols-[1fr_20vw]',
      )}
    >
      <DataContent items={formatData(summary)} />
      <aside className="grid grid-cols-1 grid-rows-[min-content_1fr] ">
        {isWin ? <WinSummaryAside /> : <LossSummaryAside />}
      </aside>
    </div>
  )
}
type SummaryPayload = NonNullable<LastRun>

const SUMMARY_TEXT = {
  win: 'You own the table now',
  loss: 'You suffered a gambling problem',
}

const SUMMARY_ROWS = [
  {
    label: 'Total exploits used',
    getValue: (payload: SummaryPayload) => payload.exploitsUsed,
  },
  {
    label: 'Final Score',
    getValue: (payload: SummaryPayload) => payload.finalScore,
  },
  {
    label: 'Money Spent',
    getValue: (payload: SummaryPayload) => payload.moneySpend,
  },
  {
    label: 'Money Earned',
    getValue: (payload: SummaryPayload) => payload.moneyTotal,
  },
]

const formatData = (payload: SummaryPayload) => {
  const message = payload.typeEnd === 'WIN' ? SUMMARY_TEXT.win : SUMMARY_TEXT.loss
  const items = [
    ({ ...args }) => (
      <Row
        text={message}
        className={cn(
          payload.typeEnd === 'WIN' ? 'text-green-500' : 'text-red-500',
          'text-5xl ',
        )}
        {...args}
      />
    ),
    ...SUMMARY_ROWS.map(({ label, getValue }) => ({ ...args }) => (
      <Row
        text={`${label}: ${getValue(payload)}`}
        {...args}
        duration={0.5}
        className="ml-5"
      />
    )),
  ]
  return items
}

function WinSummaryAside() {
  return (
    <div className="h-full border-l border-[#00FDFF]/30 bg-[#061313] px-5 py-6 flex flex-col items-center justify-between overflow-hidden">
      <div className="w-full text-right text-[#00FDFF] text-3xl tracking-[0.35em] uppercase">
        win
      </div>
      <div className="relative grid place-items-center">
        <div className="absolute size-56 rounded-full border border-[#00FDFF]/25" />
        <div className="absolute size-72 rounded-full border border-[#E5E500]/15" />
        <img
          src={exploitCover}
          className="relative w-32 [image-rendering:pixelated] drop-shadow-[0_0_22px_rgba(0,253,255,0.45)]"
        />
      </div>
      <div className="w-full text-[#E5E500] text-right text-xl uppercase tracking-[0.2em]">
        access granted
      </div>
    </div>
  )
}

function LossSummaryAside() {
  return <img src={gunsuhut} className="w-full aspect-square object-cover" />
}
