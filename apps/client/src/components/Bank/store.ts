import { SERVER_PATH } from '#/env'
import { useEventSender } from '#/stores/eventsStore'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { BankData } from '@repo/types/server'
import { create } from 'zustand'

const MIN_PAY = 500
type Store = {
  data: BankData | null
  setState: (param: Partial<Store['data']>) => void
}
export const useBankStore = create<Store>((set) => ({
  data: getLocalData(),
  setState: (param) =>
    set((prev) => {
      const new_data = { ...prev.data, ...param } as Store['data']
      localStorage.setItem('bank', JSON.stringify(new_data))
      return { data: new_data }
    }),
}))
export async function fetchData(num = 1) {
  try {
    const res = await fetch(`${SERVER_PATH}/api/game/status/bank`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Error fetching data')
    const data = await res.json()
    useBankStore.setState({ data })
  } catch {
    console.error('Error fetching data')
    useBankStore.setState({ data: null })
    const time = 500 * 2 ** num
    await new Promise((resolve) => setTimeout(resolve, time))
    fetchData(num + 1)
  }
}
function getLocalData(): Store['data'] {
  const data = localStorage.getItem('bank') ?? null
  const parsed = data ? JSON.parse(data) : null
  fetchData()
  return parsed
}
export const useBankLoading = () => {
  const data = useBankStore((s) => s.data)
  return !data
}
const useDataBank = () => {
  const data = useBankStore((s) => s.data)
  if (!data) throw new Error('Data not defined')
  return data
}
export const useBankMoney = () => {
  const { money: balance } = useDataBank()
  return balance
}
export const useCanPayDebt = () => {
  const { user } = useGameState()
  const percent = usePayPercent()
  return percent !== 100 && user.money >= MIN_PAY
}

export const useIncrementPay = () => {
  const setState = useBankStore((s) => s.setState)
  const canPay = useCanPayDebt()
  const { user } = useGameState()
  const setGame = useGameUpdate()
  const send = useEventSender()
  const { pay, credit } = useDataBank()
  return () => {
    if (pay >= credit || !canPay) return
    setState({ pay: pay + MIN_PAY, money: user.money - MIN_PAY })
    send({
      eventId: 'mafia:pay',
      payload: { money: MIN_PAY, player: user.playerId },
    })
    setGame({ user: { ...user, money: user.money - MIN_PAY } })
  }
}

export const usePayedBank = () => {
  const { pay, credit } = useDataBank()
  return credit - pay
}
export const usePayPercent = () => {
  const { pay, credit } = useDataBank()
  return Math.floor((pay / credit) * 100)
}
export const useRankBank = () => {
  const { next_rank: rank, current_rank } = useDataBank()
  if (!rank) return null
  const percent = Math.min(current_rank / rank, 1)
  return percent * 100
}
export const useBankChips = () => {
  const { chips } = useDataBank()
  return chips
}
export const useRoundsLeft = () => {
  const { round_to_end } = useDataBank()
  return round_to_end
}
export const useUpdateBank = () => {
  const { user } = useGameState()
  const setState = useGameUpdate()
  const setBank = useBankStore((s) => s.setState)
  return {
    setChips: (param: number) => {
      const { chips, money } = user
      const newValue = { chips: chips + param, money: money - param }
      setBank({ ...newValue })
      setState({
        user: { ...user, ...newValue },
      })
    },
    setMoney: (param: number) => {
      const { chips, money } = user
      const newValue = { chips: chips - param, money: money + param }
      setBank({ ...newValue })
      setState({
        user: { ...user, ...newValue },
      })
    },
  }
}
