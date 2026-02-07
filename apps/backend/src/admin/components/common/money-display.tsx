import { Text } from "@medusajs/ui"

type MoneyDisplayProps = {
  amount: number
  currency?: string
  className?: string
  size?: "small" | "medium" | "large"
}

const currencySymbols: Record<string, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
  sar: "SAR",
  aed: "AED",
  cad: "C$",
  aud: "A$",
  jpy: "¥",
  cny: "¥",
  inr: "₹",
}

export function MoneyDisplay({
  amount,
  currency = "usd",
  className = "",
  size = "medium",
}: MoneyDisplayProps) {
  const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase()
  
  // Medusa stores amounts in whole units (10 = $10, not cents)
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  const sizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-xl font-semibold",
  }[size]

  return (
    <Text className={`${sizeClass} ${className}`}>
      {symbol}
      {formatted}
    </Text>
  )
}
