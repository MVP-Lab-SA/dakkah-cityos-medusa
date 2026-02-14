const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
])

export function convertFromCents(amount: number, currencyCode: string): number {
  const code = currencyCode.toLowerCase()
  if (ZERO_DECIMAL_CURRENCIES.has(code)) return amount
  return amount / 100
}

export function formatCurrency(
  amount: number,
  currencyCode?: string,
  locale: string = "en-US"
): string {
  if (!currencyCode) {
    return amount.toString()
  }

  const code = currencyCode.toUpperCase()
  const displayAmount = convertFromCents(amount, currencyCode)

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
    }).format(displayAmount)
  } catch {
    return `${displayAmount} ${code}`
  }
}

export function formatCurrencyFromDecimal(
  amount: number,
  currencyCode?: string,
  locale: string = "en-US"
): string {
  if (!currencyCode) {
    return amount.toString()
  }

  const code = currencyCode.toUpperCase()

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
    }).format(amount)
  } catch {
    return `${amount} ${code}`
  }
}
