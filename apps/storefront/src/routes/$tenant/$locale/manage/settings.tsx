import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, SectionCard } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { BuildingStorefront, GlobeEurope, CurrencyDollar, BellAlert } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/manage/settings")({
  component: ManageSettingsPage,
})

function ManageSettingsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"

  const [form, setForm] = useState({
    storeName: "",
    description: "",
    logoUrl: "",
    timezone: "UTC",
    defaultLocale: "en",
    defaultCurrency: "USD",
    guestCheckout: true,
    trackInventory: true,
    allowBackorders: false,
    notifyNewOrder: true,
    notifyLowStock: true,
  })

  const inputClass = "w-full px-3 py-2 bg-ds-background border border-ds-border rounded-lg text-sm text-ds-text placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title={t(locale, "manage.settings")}
          subtitle={t(locale, "manage.store_management")}
          actions={
            <button
              type="button"
              className="px-6 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t(locale, "manage.save_settings")}
            </button>
          }
        />

        <SectionCard
          title={t(locale, "manage.store_info")}
          headerAction={<BuildingStorefront className="w-4 h-4 text-ds-muted-foreground" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ds-muted-foreground mb-1">{t(locale, "manage.store_name")}</label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ds-muted-foreground mb-1">{t(locale, "manage.logo_url")}</label>
              <input
                type="url"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-ds-muted-foreground mb-1">{t(locale, "manage.description")}</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={t(locale, "manage.localization")}
          headerAction={<GlobeEurope className="w-4 h-4 text-ds-muted-foreground" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ds-muted-foreground mb-1">{t(locale, "manage.timezone")}</label>
              <input
                type="text"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ds-muted-foreground mb-1">{t(locale, "manage.default_locale")}</label>
              <select
                value={form.defaultLocale}
                onChange={(e) => setForm({ ...form, defaultLocale: e.target.value })}
                className={inputClass}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ds-muted-foreground mb-1">{t(locale, "manage.default_currency")}</label>
              <select
                value={form.defaultCurrency}
                onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}
                className={inputClass}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={t(locale, "manage.commerce_settings")}
          headerAction={<CurrencyDollar className="w-4 h-4 text-ds-muted-foreground" />}
        >
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
        </SectionCard>

        <SectionCard
          title={t(locale, "manage.notifications")}
          headerAction={<BellAlert className="w-4 h-4 text-ds-muted-foreground" />}
        >
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
        </SectionCard>
      </Container>
    </ManageLayout>
  )
}
