export const CURRENCY_SYMBOL = 'ЅМ'
export const CURRENCY_CODE = 'TJS'

export function formatCurrency(amount: number, symbol: string = CURRENCY_SYMBOL): string {
  return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export function formatCurrencyAmount(amount: number, includeSymbol: boolean = true): string {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return includeSymbol ? `${CURRENCY_SYMBOL}${formatted}` : formatted
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '')
  return parseFloat(cleaned) || 0
}
