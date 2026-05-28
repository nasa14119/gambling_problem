import { SERVER_PATH } from '#/env'
import { useGameState, useGameUpdate } from '#/stores/gameStore'
import type { BankData } from '@repo/types/server'
import { create } from 'zustand'

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
export async function fetchData() {
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

export const useIncrementPay = () => {
  const setState = useBankStore((s) => s.setState)
  const { pay, credit } = useDataBank()
  return () => {
    if (pay >= credit) return
    setState({ pay: pay + 5000 })
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
  const { next_rank: rank, money } = useDataBank()
  return Math.floor(money / rank) * 100
}
export const useBankChips = () => {
  const { chips } = useDataBank()
  return chips
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
