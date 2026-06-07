import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for optimal class merging.
 * @param inputs - Class names or conditional class values.
 * @returns A single string with merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}
const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
export const formatCurrency = (value: number): string => {
  return CURRENCY_FORMAT.format(value)
}
const CHIPS_FORMAT = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
export const formatChips = (value: number): string => {
  return CHIPS_FORMAT.format(Math.floor(Math.round(value)))
}

export const sleepClient = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const padH = String(hours).padStart(2, '0')
  const padM = String(minutes).padStart(2, '0')

  return `${padH}:${padM}`
}
