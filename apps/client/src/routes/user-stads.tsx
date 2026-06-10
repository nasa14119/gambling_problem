import { useAuthValidate } from '#/components/Login/store'
import { NavBar } from '#/components/Nav/NavBar'
import { SERVER_PATH } from '#/env'
import { cn, formatCurrency } from '#/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import type { UserSummary } from '@repo/types/server'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/user-stads')({
  component: UserStats,
})

async function fetchUserSummary(): Promise<UserSummary> {
  const res = await fetch(`${SERVER_PATH}/api/stats/user-summary`, {
    credentials: 'include',
  })

  if (res.status === 204) return null
  if (res.status !== 200) {
    throw new Error(`Error loading user summary: ${res.status}`)
  }

  return await res.json()
}

function formatHours(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

function UserStats() {
  useAuthValidate()
  const [summary, setSummary] = useState<UserSummary>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchUserSummary()
      .then(setSummary)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="h-screen w-screen flex flex-col">
      <NavBar />
      <section className="px-6 py-5 flex-1 min-h-0">
        <h1 className="text-6xl font-semibold tracking-widest uppercase">
          User Stats
        </h1>
        <div className="mt-6 h-full min-h-0">
          {loading && <StateMessage text="Loading stats..." />}
          {error && <StateMessage text="Error loading stats" />}
          {!loading && !error && !summary && (
            <StateMessage text="No personal stats found" />
          )}
          {!loading && !error && summary && <StatsContent summary={summary} />}
        </div>
      </section>
    </main>
  )
}

function StatsContent({ summary }: { summary: NonNullable<UserSummary> }) {
  return (
    <div className="grid grid-cols-3 gap-4 font-sans">
      <Stat
        className="col-span-3"
        label="Total time played"
        value={formatHours(summary.totalTimePlayingMinutes)}
      />
      <Stat label="Total runs" value={summary.totalRuns} />
      <Stat label="Exploits used" value={summary.totalExploitsUsed} />
      <Stat
        label="Total score"
        value={`$${formatCurrency(summary.totalScore)}`}
      />
      <Stat
        label="Money won"
        value={`$${formatCurrency(summary.totalMoneyWon)}`}
      />
      <Stat
        label="Money spent"
        value={`$${formatCurrency(summary.totalMoneySpend)}`}
      />
    </div>
  )
}

function Stat({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <article
      className={cn('border border-accent/30 rounded-sm p-5', className)}
    >
      <p className="text-sm text-accent font-medium">{label}</p>
      <p className="text-4xl mt-2 font-pixelated">{value}</p>
    </article>
  )
}

function StateMessage({ text }: { text: string }) {
  return (
    <div className="size-full border border-accent/30 rounded-sm flex items-center justify-center text-2xl">
      {text}
    </div>
  )
}
