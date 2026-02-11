import { useState } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { InviteFriendFormProps } from "@cityos/design-system"

export function InviteFriendForm({
  onInvite,
  loading,
  success,
  error,
  locale: localeProp,
  className,
}: InviteFriendFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onInvite(email.trim())
      if (!error) setEmail("")
    }
  }

  return (
    <div className={`bg-ds-background border border-ds-border rounded-lg p-4 md:p-6 ${className || ""}`}>
      <h3 className="font-semibold text-ds-foreground mb-1">
        {t(locale, "referral.invite_friend")}
      </h3>
      <p className="text-sm text-ds-muted-foreground mb-4">
        {t(locale, "referral.invite_description")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t(locale, "referral.email_placeholder")}
            required
            className="flex-1 px-3 py-2 border border-ds-border rounded-lg text-sm text-ds-foreground bg-ds-background"
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t(locale, "common.loading") : t(locale, "referral.send_invite")}
          </button>
        </div>

        {error && (
          <div className="px-3 py-2 bg-ds-destructive/10 rounded-lg">
            <p className="text-sm text-ds-destructive">{error}</p>
          </div>
        )}

        {success && (
          <div className="px-3 py-2 bg-ds-success/10 rounded-lg">
            <p className="text-sm text-ds-success">{t(locale, "referral.invite_sent")}</p>
          </div>
        )}
      </form>
    </div>
  )
}
