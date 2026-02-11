import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

type PaymentMethod = "visa" | "mastercard" | "amex" | "paypal" | "apple_pay" | "google_pay" | "mada" | "stc_pay" | "cash"

interface PaymentMethodsIconsProps {
  locale?: string
  methods?: PaymentMethod[]
  size?: "sm" | "md"
}

const methodLabels: Record<PaymentMethod, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  paypal: "PayPal",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
  mada: "mada",
  stc_pay: "STC Pay",
  cash: "Cash on Delivery",
}

function PaymentIcon({ method, size }: { method: PaymentMethod; size: string }) {
  const s = size === "sm" ? "w-8 h-5" : "w-10 h-6"
  const cls = `${s} rounded border border-ds-border bg-white flex items-center justify-center text-[8px] font-bold`

  const abbreviations: Record<PaymentMethod, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
    paypal: "PP",
    apple_pay: "AP",
    google_pay: "GP",
    mada: "mada",
    stc_pay: "STC",
    cash: "COD",
  }

  return (
    <div className={cls} title={methodLabels[method]} aria-label={methodLabels[method]}>
      <span className="text-gray-700">{abbreviations[method]}</span>
    </div>
  )
}

export function PaymentMethodsIcons({
  locale: localeProp,
  methods = ["visa", "mastercard", "amex", "paypal", "apple_pay", "mada"],
  size = "sm",
}: PaymentMethodsIconsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-ds-muted">{t(locale, "checkout.we_accept")}</span>
      <div className="flex items-center gap-1.5">
        {methods.map((method) => (
          <PaymentIcon key={method} method={method} size={size} />
        ))}
      </div>
    </div>
  )
}
