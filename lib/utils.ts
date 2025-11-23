import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
  }).format(value)
}

export function calculateSavings(cheapest: number, expensive: number): number {
  return expensive - cheapest
}

export function calculateSavingsPercentage(cheapest: number, expensive: number): number {
  if (expensive === 0) return 0
  return Math.round(((expensive - cheapest) / expensive) * 100)
}

