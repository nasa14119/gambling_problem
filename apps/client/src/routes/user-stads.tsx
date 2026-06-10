import { useAuthValidate } from '#/components/Login/store'
import { NavBar } from '#/components/Nav/NavBar'
import { SERVER_PATH } from '#/env'
import { cn, formatCurrency } from '#/lib/utils'
import type { ChartConfig } from '#/shadcn/ui/chart'
import { ChartContainer } from '#/shadcn/ui/chart'
import { createFileRoute } from '@tanstack/react-router'
import type { UserSummary } from '@repo/types/server'
import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'

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
        className="col-span-2"
        label="User"
        value={summary.username}
      />
      <Stat
        label="Total time played"
        value={formatHours(summary.totalTimePlayingMinutes)}
      />
      <Stat label="Total runs" value={summary.totalRuns} />
      <Stat label="Exploits used" value={summary.totalExploitsUsed} />
      <Stat
        label="Total score"
        value={`$${formatCurrency(summary.totalScore)}`}
      />
      <MoneyChart summary={summary} className="col-span-3" />
    </div>
  )
}

const moneyChartConfig = {
  won: {
    label: 'Money won',
    color: 'var(--accent)',
  },
  spent: {
    label: 'Money spent',
    color: 'hsl(30, 9%, 55%)',
  },
} satisfies ChartConfig

function MoneyChart({
  summary,
  className,
}: {
  summary: NonNullable<UserSummary>
  className?: string
}) {
  const data = [
    {
      key: 'won',
      label: 'Money won',
      value: Number(summary.totalMoneyWon),
      chartValue: Math.abs(Number(summary.totalMoneyWon)),
      fill: moneyChartConfig.won.color,
    },
    {
      key: 'spent',
      label: 'Money spent',
      value: Number(summary.totalMoneySpend),
      chartValue: Math.abs(Number(summary.totalMoneySpend)),
      fill: moneyChartConfig.spent.color,
    },
  ]
  const hasMoneyData = data.some((item) => item.chartValue > 0)

  return (
    <article
      className={cn(
        'border border-accent/30 rounded-sm p-5 min-h-80',
        className,
      )}
    >
      <p className="text-sm text-accent font-medium">Money</p>
      <div className="mt-3 grid min-h-64 grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(14rem,1fr)_minmax(14rem,0.8fr)]">
        {hasMoneyData ? (
          <ChartContainer
            config={moneyChartConfig}
            className="h-64 w-full"
            initialDimension={{ width: 320, height: 256 }}
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="chartValue"
                nameKey="label"
                outerRadius={104}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((item) => (
                  <Cell key={item.key} fill={item.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="h-64 w-full rounded-sm border border-accent/20 flex items-center justify-center text-xl text-black/50">
            No money data
          </div>
        )}
        <div className="grid gap-3">
          {data.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 border-b border-accent/10 pb-2 last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="truncate text-sm font-medium">
                  {item.label}
                </span>
              </div>
              <span className="shrink-0 font-pixelated text-2xl">
                ${formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
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
      <p className="text-4xl mt-2 font-pixelated break-all">{value}</p>
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
