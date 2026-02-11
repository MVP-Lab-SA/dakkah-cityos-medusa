import { useState } from "react"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import type { TenantSettings } from "@/lib/types/tenant-admin"

interface ManageSettingsFormProps {
  settings?: Partial<TenantSettings>
  locale?: string
  onSave?: (settings: Partial<TenantSettings>) => void
}

export function ManageSettingsForm({ settings, locale: localeProp, onSave }: ManageSettingsFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const [form, setForm] = useState({
    storeName: settings?.email_from_name || "",
    description: "",
    logoUrl: "",
    timezone: settings?.timezone || "UTC",
    defaultLocale: settings?.default_locale || "en",
    defaultCurrency: settings?.default_currency || "USD",
    guestCheckout: settings?.guest_checkout_enabled ?? true,
    trackInventory: settings?.track_inventory ?? true,
    allowBackorders: settings?.allow_backorders ?? false,
    notifyNewOrder: settings?.notify_on_new_order ?? true,
    notifyLowStock: settings?.notify_on_low_stock ?? true,
  })

  const handleSave = () => {
    if (onSave) {
      onSave({
        timezone: form.timezone,
        default_locale: form.defaultLocale,
        default_currency: form.defaultCurrency,
        guest_checkout_enabled: form.guestCheckout,
        track_inventory: form.trackInventory,
        allow_backorders: form.allowBackorders,
        notify_on_new_order: form.notifyNewOrder,
        notify_on_low_stock: form.notifyLowStock,
      })
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-ds-card border border-ds-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.store_info")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ds-muted mb-1">{t(locale, "manage.store_name")}</label>
            <input
              type="text"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ds-muted mb-1">{t(locale, "manage.logo_url")}</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-ds-muted mb-1">{t(locale, "manage.description")}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-ds-card border border-ds-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.localization")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-ds-muted mb-1">{t(locale, "manage.timezone")}</label>
            <input
              type="text"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ds-muted mb-1">{t(locale, "manage.default_locale")}</label>
            <select
              value={form.defaultLocale}
              onChange={(e) => setForm({ ...form, defaultLocale: e.target.value })}
              className="w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ds-muted mb-1">{t(locale, "manage.default_currency")}</label>
            <select
              value={form.defaultCurrency}
              onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}
              className="w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-primary"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-ds-card border border-ds-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.commerce_settings")}</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.guestCheckout}
              onChange={(e) => setForm({ ...form, guestCheckout: e.target.checked })}
              className="rounded border-ds-border text-ds-primary focus:ring-ds-primary"
            />
            <span className="text-sm text-ds-text">{t(locale, "manage.guest_checkout")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.trackInventory}
              onChange={(e) => setForm({ ...form, trackInventory: e.target.checked })}
              className="rounded border-ds-border text-ds-primary focus:ring-ds-primary"
            />
            <span className="text-sm text-ds-text">{t(locale, "manage.track_inventory")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.allowBackorders}
              onChange={(e) => setForm({ ...form, allowBackorders: e.target.checked })}
              className="rounded border-ds-border text-ds-primary focus:ring-ds-primary"
            />
            <span className="text-sm text-ds-text">{t(locale, "manage.allow_backorders")}</span>
          </label>
        </div>
      </section>

      <section className="bg-ds-card border border-ds-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.notifications")}</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.notifyNewOrder}
              onChange={(e) => setForm({ ...form, notifyNewOrder: e.target.checked })}
              className="rounded border-ds-border text-ds-primary focus:ring-ds-primary"
            />
            <span className="text-sm text-ds-text">{t(locale, "manage.notify_new_order")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.notifyLowStock}
              onChange={(e) => setForm({ ...form, notifyLowStock: e.target.checked })}
              className="rounded border-ds-border text-ds-primary focus:ring-ds-primary"
            />
            <span className="text-sm text-ds-text">{t(locale, "manage.notify_low_stock")}</span>
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t(locale, "manage.save_settings")}
        </button>
      </div>
    </div>
  )
}
