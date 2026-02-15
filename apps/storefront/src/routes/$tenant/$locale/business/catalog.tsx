import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { WholesaleCatalog } from "@/components/wholesale/wholesale-catalog"
import { TierPricingTable } from "@/components/wholesale/tier-pricing-table"
import { BulkOrderForm } from "@/components/wholesale/bulk-order-form"
import { RFQForm } from "@/components/wholesale/rfq-form"
import { AccountLayout } from "@/components/account"
import { t, type SupportedLocale } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/business/catalog")({
  component: BusinessCatalogPage,
})

const demoProducts = [
  { id: "w1", sku: "WH-001", name: "Industrial Widget A", basePrice: 12.5, currency: "USD", minOrder: 50, inStock: true },
  { id: "w2", sku: "WH-002", name: "Premium Bolt Set", basePrice: 8.75, currency: "USD", minOrder: 100, inStock: true },
  { id: "w3", sku: "WH-003", name: "Heavy-Duty Cable (10m)", basePrice: 24.0, currency: "USD", minOrder: 25, inStock: true },
  { id: "w4", sku: "WH-004", name: "Custom Label Kit", basePrice: 5.25, currency: "USD", minOrder: 200, inStock: false },
]

const demoTiers = [
  { minQuantity: 1, maxQuantity: 49, unitPrice: 12.5, discountPercent: 0 },
  { minQuantity: 50, maxQuantity: 199, unitPrice: 11.0, discountPercent: 12 },
  { minQuantity: 200, maxQuantity: 499, unitPrice: 9.5, discountPercent: 24 },
  { minQuantity: 500, unitPrice: 7.5, discountPercent: 40 },
]

function BusinessCatalogPage() {
  const { locale } = Route.useParams() as { tenant: string; locale: string }
  const [activeTab, setActiveTab] = useState<"catalog" | "quick" | "rfq">("catalog")

  const tabs = [
    { id: "catalog" as const, label: t(locale, "wholesale.b2b_catalog") },
    { id: "quick" as const, label: t(locale, "wholesale.quick_order") },
    { id: "rfq" as const, label: t(locale, "wholesale.rfq") },
  ]

  return (
    <AccountLayout title={t(locale, "wholesale.title")} description={t(locale, "wholesale.catalog_description")}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-1 bg-ds-muted rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-ds-card text-ds-foreground shadow-sm"
                  : "text-ds-muted-foreground hover:text-ds-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "catalog" && (
          <div className="space-y-6">
            <WholesaleCatalog
              locale={locale}
              products={demoProducts}
            />
            <TierPricingTable
              locale={locale}
              tiers={demoTiers}
              basePrice={12.5}
              currency="USD"
            />
          </div>
        )}

        {activeTab === "quick" && (
          <BulkOrderForm locale={locale} />
        )}

        {activeTab === "rfq" && (
          <RFQForm locale={locale} />
        )}
      </div>
    </AccountLayout>
  )
}
