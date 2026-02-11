import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface CheckoutTrustSignalsProps {
  locale?: string
}

export function CheckoutTrustSignals({ locale: localeProp }: CheckoutTrustSignalsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const signals = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      label: t(locale, "checkout.secure_checkout"),
      desc: t(locale, "checkout.ssl_encrypted"),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: t(locale, "checkout.money_back"),
      desc: t(locale, "checkout.money_back_desc"),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      label: t(locale, "checkout.secure_payment"),
      desc: t(locale, "checkout.secure_payment_desc"),
    },
  ]

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-4">
        {signals.map((signal, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-ds-success/10 rounded-full flex items-center justify-center text-ds-success">
              {signal.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-ds-text">{signal.label}</p>
              <p className="text-xs text-ds-muted">{signal.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
