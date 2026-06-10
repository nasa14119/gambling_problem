import gunsuhut from '#/assets/gunshut.png'
import { Content as DataContent } from '#/components/Summary/Content'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Row } from '#/components/Summary/Row'
import { cn } from '#/lib/utils'
import { SERVER_PATH } from '#/env'
import type { LastRun } from '@repo/types/server'

export const Route = createFileRoute('/summary')({ component: Summary })
async function getSummary(): Promise<LastRun | null> {
  const res = await fetch(`${SERVER_PATH}/api/stats/user-last-run-summary`, {
    credentials: 'include',
  })
  if (res.status === 204) return null
  return await res.json()
}
function Summary() {
  const { navigate } = useRouter()
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
  return (
    <div className="font-pixelated text-white bg-black fixed inset-0 grid grid-cols-[1fr_20vw] grid-rows-1 ">
      <ContentWithData />
      <aside className="grid grid-cols-1 grid-rows-[min-content_1fr] ">
        <img src={gunsuhut} className="w-full aspect-square object-cover" />
      </aside>
    </div>
  )
}
type SummaryPayload = NonNullable<LastRun>

const SUMMARY_TEXT = {
  win: 'You are part of the mafia now',
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
function ContentWithData() {
  const [querry, setQuerry] = useState<any>(null)
  useEffect(() => {
    getSummary().then((update) => {
        if (update == null) return
      setQuerry(update)
    })
}, [])
  if (!querry) return null
  return <DataContent items={formatData(querry)} />
}
