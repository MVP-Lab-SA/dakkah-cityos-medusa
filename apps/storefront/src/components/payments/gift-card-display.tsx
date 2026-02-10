import { useState } from "react"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface GiftCardDisplayProps {
  code?: string
  balance: number
  originalAmount: number
  currency?: string
  expiresAt?: string
  status: "active" | "redeemed" | "expired" | "disabled"
  recipientEmail?: string
  senderName?: string
  message?: string
  locale: string
}

const statusStyles: Record<string, string> = {
  active: "bg-ds-success/10 text-ds-success",
  redeemed: "bg-ds-accent/10 text-ds-accent",
  expired: "bg-ds-destructive/10 text-ds-destructive",
  disabled: "bg-ds-muted text-ds-muted-foreground",
}

export function GiftCardDisplay({
  code,
  balance,
  originalAmount,
  currency = "USD",
  expiresAt,
  status,
  recipientEmail,
  senderName,
  message,
  locale,
}: GiftCardDisplayProps) {
  const [revealed, setRevealed] = useState(false)
  const loc = locale as SupportedLocale

  const maskedCode = code ? code.replace(/./g, (c, i) => (i < code.length - 4 ? "•" : c)) : "••••"

  return (
    <div className="bg-gradient-to-br from-ds-primary/10 via-ds-background to-ds-primary/5 rounded-xl border border-ds-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ds-muted-foreground">
              {t(locale, "payment.gift_cards")}
            </p>
            <p className="text-2xl font-bold text-ds-foreground mt-1">
              {formatCurrency(balance, currency, loc)}
            </p>
            {balance < originalAmount && (
              <p className="text-xs text-ds-muted-foreground mt-0.5 line-through">
                {formatCurrency(originalAmount, currency, loc)}
              </p>
            )}
          </div>
          <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", statusStyles[status])}>
            {t(locale, `payment.${status}`)}
          </span>
        </div>

        {code && (
          <div className="mb-4">
            <p className="text-xs text-ds-muted-foreground mb-1">{t(locale, "payment.card_code")}</p>
            <button
              onClick={() => setRevealed(!revealed)}
              className="font-mono text-lg tracking-widest text-ds-foreground bg-ds-muted px-4 py-2 rounded-lg hover:bg-ds-muted/80 transition-colors w-full text-start"
            >
              {revealed ? code : maskedCode}
              <span className="text-xs font-sans text-ds-muted-foreground ms-2">
                {revealed ? t(locale, "payment.hide_code") : t(locale, "payment.reveal_code")}
              </span>
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          {expiresAt && (
            <div>
              <span className="text-ds-muted-foreground">{t(locale, "payment.expires")}: </span>
              <span className="text-ds-foreground font-medium">
                {new Date(expiresAt).toLocaleDateString()}
              </span>
            </div>
          )}
          {!expiresAt && status === "active" && (
            <div>
              <span className="text-ds-muted-foreground">{t(locale, "payment.no_expiry")}</span>
            </div>
          )}
        </div>
      </div>

      {(senderName || recipientEmail || message) && (
        <div className="border-t border-ds-border bg-ds-muted/30 px-6 py-4 space-y-2">
          {senderName && (
            <p className="text-sm text-ds-muted-foreground">
              {t(locale, "payment.from")}: <span className="text-ds-foreground font-medium">{senderName}</span>
            </p>
          )}
          {recipientEmail && (
            <p className="text-sm text-ds-muted-foreground">
              {t(locale, "payment.to")}: <span className="text-ds-foreground font-medium">{recipientEmail}</span>
            </p>
          )}
          {message && (
            <p className="text-sm text-ds-foreground italic mt-2">&ldquo;{message}&rdquo;</p>
          )}
        </div>
      )}
    </div>
  )
}

interface GiftCardPurchaseFormProps {
  amounts: number[]
  currency?: string
  locale: string
  onPurchase: (data: { amount: number; recipientEmail: string; senderName?: string; message?: string }) => void
  loading?: boolean
}

export function GiftCardPurchaseForm({
  amounts,
  currency = "USD",
  locale,
  onPurchase,
  loading = false,
}: GiftCardPurchaseFormProps) {
  const loc = locale as SupportedLocale
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [useCustom, setUseCustom] = useState(false)

  const finalAmount = useCustom ? parseFloat(customAmount) || 0 : selectedAmount || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (finalAmount <= 0 || !recipientEmail) return
    onPurchase({
      amount: finalAmount,
      recipientEmail,
      senderName: senderName || undefined,
      message: message || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ds-background rounded-xl border border-ds-border p-6 space-y-6">
      <h3 className="text-lg font-semibold text-ds-foreground">{t(locale, "payment.purchase_gift_card")}</h3>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-3">
          {t(locale, "payment.gift_card_amount")}
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {amounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => { setSelectedAmount(amount); setUseCustom(false) }}
              className={clsx(
                "py-3 rounded-lg text-sm font-semibold transition-colors border",
                !useCustom && selectedAmount === amount
                  ? "bg-ds-primary text-ds-primary-foreground border-transparent"
                  : "bg-ds-background text-ds-foreground border-ds-border hover:bg-ds-muted"
              )}
            >
              {formatCurrency(amount, currency, loc)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseCustom(true)}
            className={clsx(
              "text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors",
              useCustom
                ? "bg-ds-primary text-ds-primary-foreground border-transparent"
                : "text-ds-muted-foreground border-ds-border hover:bg-ds-muted"
            )}
          >
            {t(locale, "payment.custom_amount")}
          </button>
          {useCustom && (
            <input
              type="number"
              min="1"
              step="0.01"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
              placeholder="0.00"
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1">
            {t(locale, "payment.recipient_email")}
          </label>
          <input
            type="email"
            required
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1">
            {t(locale, "payment.sender_name")}
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ds-foreground mb-1">
            {t(locale, "payment.personal_message")}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={finalAmount <= 0 || !recipientEmail || loading}
        className="w-full py-3 text-sm font-semibold bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t(locale, "common.loading") : `${t(locale, "payment.purchase")} ${finalAmount > 0 ? formatCurrency(finalAmount, currency, loc) : ""}`}
      </button>
    </form>
  )
}
