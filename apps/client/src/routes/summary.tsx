import gunsuhut from '#/assets/gunshut.png'
import { Content as DataContent } from '#/components/Summary/Content'
import data from '#/assets/dummy.json'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Row } from '#/components/Summary/Row'
import { cn } from '#/lib/utils'
import { useEventClear } from '#/stores/eventsStore'

export const Route = createFileRoute('/summary')({ component: Summary })
async function getSummary() {
  return data
}
function Summary() {
  const { navigate } = useRouter()
  const clear = useEventClear()
  useEffect(() => {
    clear()
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
    <div className="font-pixelated text-white bg-black fixed inset-0 grid grid-cols-[1fr_min-content] grid-rows-1">
      <ContentWithData />
      <aside className="grid grid-cols-1 grid-rows-[min-content_1fr] w-[20vw]">
        <img src={gunsuhut} className="w-full aspect-square object-cover" />
      </aside>
    </div>
  )
}
const formatData = (payload: Record<string, string | number>) => {
  const { type, ...rest } = payload
  const message =
    type === 'win'
      ? 'You are part of the mafia now'
      : 'You suffered a gambling problem'
  const items = [
    ({ ...args }) => (
      <Row
        text={message}
        className={cn(
          type === 'win' ? 'text-green-500' : 'text-red-500',
          'text-5xl',
        )}
        {...args}
      />
    ),
    ...Object.entries(rest).map(([key, value]) => ({ ...args }) => (
      <Row
        text={`${key}: ${value}`}
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
    getSummary().then((data) => {
      setQuerry(data)
    })
  }, [])
  if (!querry) return null
  return <DataContent items={formatData(querry)} />
}
