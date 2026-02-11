import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { GiftCardMessageFormProps } from "@cityos/design-system"

export function GiftCardMessageForm({
  recipientEmail = "",
  recipientName = "",
  senderName = "",
  message = "",
  deliveryDate = "",
  onFieldChange,
  onSubmit,
  loading,
  locale: localeProp,
  className,
}: GiftCardMessageFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className={`bg-ds-background border border-ds-border rounded-lg p-4 md:p-6 ${className || ""}`}>
      <h3 className="text-sm font-medium text-ds-foreground mb-4">
        {t(locale, "giftCards.personalize")}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-ds-muted-foreground block mb-1.5">
            {t(locale, "giftCards.recipient_name")}
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => onFieldChange("recipientName", e.target.value)}
            placeholder={t(locale, "giftCards.recipient_name_placeholder")}
            className="w-full px-3 py-2 border border-ds-border rounded-lg text-sm text-ds-foreground bg-ds-background"
          />
        </div>
        <div>
          <label className="text-sm text-ds-muted-foreground block mb-1.5">
            {t(locale, "giftCards.recipient_email")} *
          </label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => onFieldChange("recipientEmail", e.target.value)}
            placeholder={t(locale, "giftCards.recipient_email_placeholder")}
            required
            className="w-full px-3 py-2 border border-ds-border rounded-lg text-sm text-ds-foreground bg-ds-background"
          />
        </div>
        <div>
          <label className="text-sm text-ds-muted-foreground block mb-1.5">
            {t(locale, "giftCards.sender_name")}
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => onFieldChange("senderName", e.target.value)}
            placeholder={t(locale, "giftCards.sender_name_placeholder")}
            className="w-full px-3 py-2 border border-ds-border rounded-lg text-sm text-ds-foreground bg-ds-background"
          />
        </div>
        <div>
          <label className="text-sm text-ds-muted-foreground block mb-1.5">
            {t(locale, "giftCards.personal_message")}
          </label>
          <textarea
            value={message}
            onChange={(e) => onFieldChange("message", e.target.value)}
            placeholder={t(locale, "giftCards.message_placeholder")}
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2 border border-ds-border rounded-lg text-sm text-ds-foreground bg-ds-background resize-none"
          />
          <p className="text-xs text-ds-muted-foreground mt-1 text-end">
            {message.length}/200
          </p>
        </div>
        <div>
          <label className="text-sm text-ds-muted-foreground block mb-1.5">
            {t(locale, "giftCards.delivery_date")}
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => onFieldChange("deliveryDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-ds-border rounded-lg text-sm text-ds-foreground bg-ds-background"
          />
          <p className="text-xs text-ds-muted-foreground mt-1">
            {t(locale, "giftCards.delivery_date_hint")}
          </p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !recipientEmail}
          className="w-full py-3 px-4 bg-ds-primary text-ds-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t(locale, "common.loading") : t(locale, "giftCards.send_gift_card")}
        </button>
      </div>
    </div>
  )
}
