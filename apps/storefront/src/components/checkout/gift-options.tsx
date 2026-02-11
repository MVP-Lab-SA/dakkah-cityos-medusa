import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface GiftOptionsProps {
  locale?: string
  onGiftOptionsChange?: (options: { isGift: boolean; wrapStyle?: string; message?: string }) => void
  wrapStyles?: { id: string; label: string; price: string }[]
}

export function GiftOptions({ locale: localeProp, onGiftOptionsChange, wrapStyles = [] }: GiftOptionsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [isGift, setIsGift] = useState(false)
  const [wrapStyle, setWrapStyle] = useState("")
  const [message, setMessage] = useState("")

  const handleToggle = () => {
    const next = !isGift
    setIsGift(next)
    onGiftOptionsChange?.({ isGift: next, wrapStyle, message })
  }

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isGift}
          onChange={handleToggle}
          className="w-4 h-4 rounded border-ds-border text-ds-primary focus:ring-ds-primary"
        />
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-ds-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <span className="text-sm font-medium text-ds-text">{t(locale, "checkout.gift_option")}</span>
        </div>
      </label>

      {isGift && (
        <div className="mt-4 space-y-4 ps-7">
          {wrapStyles.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-ds-muted mb-2">
                {t(locale, "checkout.gift_wrap_style")}
              </label>
              <div className="flex flex-wrap gap-2">
                {wrapStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setWrapStyle(style.id)
                      onGiftOptionsChange?.({ isGift, wrapStyle: style.id, message })
                    }}
                    className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                      wrapStyle === style.id
                        ? "border-ds-primary bg-ds-primary/10 text-ds-primary"
                        : "border-ds-border text-ds-muted hover:border-ds-primary/50"
                    }`}
                  >
                    {style.label} ({style.price})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ds-muted mb-2">
              {t(locale, "checkout.gift_message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                onGiftOptionsChange?.({ isGift, wrapStyle, message: e.target.value })
              }}
              rows={3}
              maxLength={200}
              placeholder={t(locale, "checkout.gift_message_placeholder")}
              className="w-full px-3 py-2 text-sm bg-ds-accent border border-ds-border rounded-md text-ds-text placeholder:text-ds-muted focus:outline-none focus:ring-1 focus:ring-ds-primary resize-none"
            />
            <p className="text-xs text-ds-muted mt-1 text-end">{message.length}/200</p>
          </div>
        </div>
      )}
    </div>
  )
}
