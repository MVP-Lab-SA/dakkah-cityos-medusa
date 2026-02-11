import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, SectionCard, Input, Select, Label, Button } from "@/components/manage/ui"
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

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader
          title={t(locale, "manage.settings")}
          subtitle={t(locale, "manage.store_management")}
          actions={
            <Button variant="primary" size="base">
              {t(locale, "manage.save_settings")}
            </Button>
          }
        />

        <SectionCard
          title={t(locale, "manage.store_info")}
          headerAction={<BuildingStorefront className="w-3.5 h-3.5 text-gray-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t(locale, "manage.store_name")}</Label>
              <Input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              />
            </div>
            <div>
              <Label>{t(locale, "manage.logo_url")}</Label>
              <Input
                type="url"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label>{t(locale, "manage.description")}</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={t(locale, "manage.localization")}
          headerAction={<GlobeEurope className="w-3.5 h-3.5 text-gray-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>{t(locale, "manage.timezone")}</Label>
              <Input
                type="text"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              />
            </div>
            <div>
              <Label>{t(locale, "manage.default_locale")}</Label>
              <Select
                value={form.defaultLocale}
                onChange={(e) => setForm({ ...form, defaultLocale: e.target.value })}
                options={[
                  { value: "en", label: "English" },
                  { value: "fr", label: "Français" },
                  { value: "ar", label: "العربية" },
                ]}
              />
            </div>
            <div>
              <Label>{t(locale, "manage.default_currency")}</Label>
              <Select
                value={form.defaultCurrency}
                onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })}
                options={[
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                  { value: "GBP", label: "GBP" },
                  { value: "AED", label: "AED" },
                  { value: "SAR", label: "SAR" },
                ]}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={t(locale, "manage.commerce_settings")}
          headerAction={<CurrencyDollar className="w-3.5 h-3.5 text-gray-400" />}
        >
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.guestCheckout}
                onChange={(e) => setForm({ ...form, guestCheckout: e.target.checked })}
                className="w-4 h-4 rounded border-gray-200 text-violet-600 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-900">{t(locale, "manage.guest_checkout")}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.trackInventory}
                onChange={(e) => setForm({ ...form, trackInventory: e.target.checked })}
                className="w-4 h-4 rounded border-gray-200 text-violet-600 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-900">{t(locale, "manage.track_inventory")}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.allowBackorders}
                onChange={(e) => setForm({ ...form, allowBackorders: e.target.checked })}
                className="w-4 h-4 rounded border-gray-200 text-violet-600 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-900">{t(locale, "manage.allow_backorders")}</span>
            </label>
          </div>
        </SectionCard>

        <SectionCard
          title={t(locale, "manage.notifications")}
          headerAction={<BellAlert className="w-3.5 h-3.5 text-gray-400" />}
        >
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyNewOrder}
                onChange={(e) => setForm({ ...form, notifyNewOrder: e.target.checked })}
                className="w-4 h-4 rounded border-gray-200 text-violet-600 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-900">{t(locale, "manage.notify_new_order")}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyLowStock}
                onChange={(e) => setForm({ ...form, notifyLowStock: e.target.checked })}
                className="w-4 h-4 rounded border-gray-200 text-violet-600 accent-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-gray-900">{t(locale, "manage.notify_low_stock")}</span>
            </label>
          </div>
        </SectionCard>
      </Container>
    </ManageLayout>
  )
}
