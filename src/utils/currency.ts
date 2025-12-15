export const CURRENCY_SYMBOL = 'SM'
export const CURRENCY_CODE = 'TJS'

export function formatCurrency(amount: number, symbol: string = CURRENCY_SYMBOL): string {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${symbol}${formatted}`
}

export function formatCurrencyAmount(amount: number, includeSymbol: boolean = true): string {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return includeSymbol ? `${CURRENCY_SYMBOL}${formatted}` : formatted
}

export function parseCurrency(value: string): number {
  try {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  } catch {
    return 0
  }
}
