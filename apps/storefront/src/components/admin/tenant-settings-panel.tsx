import { useTenantSettings, useTenantBilling, useTenantUsage, useTenantInvoices } from "@/lib/hooks/use-tenant-admin"
import type { TenantSettings, TenantBilling, TenantUsageRecord, TenantInvoice } from "@/lib/types/tenant-admin"

export function TenantSettingsPanel() {
  const { data: settingsData, isLoading: loadingSettings } = useTenantSettings()
  const { data: billingData, isLoading: loadingBilling } = useTenantBilling()
  const { data: usageData, isLoading: loadingUsage } = useTenantUsage()
  const { data: invoicesData, isLoading: loadingInvoices } = useTenantInvoices()

  const isLoading = loadingSettings || loadingBilling

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="h-5 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const settings = settingsData?.settings
  const billing = billingData?.billing
  const usage = usageData?.records?.[0]
  const invoices = invoicesData?.invoices || []

  return (
    <div className="space-y-6">
      {billing && <BillingCard billing={billing} />}
      {settings && <SettingsCard settings={settings} />}
      {usage && <UsageCard usage={usage} />}
      {invoices.length > 0 && <InvoicesList invoices={invoices} />}
    </div>
  )
}

function BillingCard({ billing }: { billing: TenantBilling }) {
  const planColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-800",
    starter: "bg-blue-100 text-blue-800",
    professional: "bg-purple-100 text-purple-800",
    enterprise: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Billing</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Plan</p>
          <span className={`px-3 py-1 rounded text-sm font-medium ${planColors[billing.plan] || "bg-gray-100"}`}>
            {billing.plan.charAt(0).toUpperCase() + billing.plan.slice(1)}
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Monthly Amount</p>
          <p className="font-bold text-xl">${billing.monthly_amount}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium">{billing.status}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Next Billing</p>
          <p className="font-medium">{new Date(billing.next_billing_date).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

function SettingsCard({ settings }: { settings: TenantSettings }) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Settings</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Commerce</p>
          <p>Currency: {settings.commerce.default_currency}</p>
          <p>Tax inclusive: {settings.commerce.tax_inclusive ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Limits</p>
          {settings.limits.max_products && <p>Products: {settings.limits.max_products}</p>}
          {settings.limits.max_vendors && <p>Vendors: {settings.limits.max_vendors}</p>}
          {settings.limits.max_users && <p>Users: {settings.limits.max_users}</p>}
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Notifications</p>
          <p>Email: {settings.notifications.email_enabled ? "On" : "Off"}</p>
          <p>SMS: {settings.notifications.sms_enabled ? "On" : "Off"}</p>
          <p>Push: {settings.notifications.push_enabled ? "On" : "Off"}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Features</p>
          {Object.entries(settings.features).slice(0, 4).map(([key, enabled]) => (
            <p key={key}>
              {key}: {enabled ? "Enabled" : "Disabled"}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

function UsageCard({ usage }: { usage: TenantUsageRecord }) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Current Usage</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricItem label="API Calls" value={usage.metrics.api_calls.toLocaleString()} />
        <MetricItem label="Storage" value={`${(usage.metrics.storage_used_mb / 1024).toFixed(1)} GB`} />
        <MetricItem label="Products" value={usage.metrics.active_products.toString()} />
        <MetricItem label="Orders" value={usage.metrics.orders_processed.toString()} />
        <MetricItem label="Vendors" value={usage.metrics.active_vendors.toString()} />
        <MetricItem label="Users" value={usage.metrics.active_users.toString()} />
        <MetricItem label="Revenue" value={`$${usage.metrics.revenue_processed.toLocaleString()}`} />
        <MetricItem label="Bandwidth" value={`${(usage.metrics.bandwidth_used_mb / 1024).toFixed(1)} GB`} />
      </div>
    </div>
  )
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  )
}

function InvoicesList({ invoices }: { invoices: TenantInvoice[] }) {
  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-muted/20">
        <h3 className="font-semibold">Billing History</h3>
      </div>
      <div className="divide-y">
        {invoices.map((invoice: TenantInvoice) => (
          <div key={invoice.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{invoice.invoice_number}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(invoice.period_start).toLocaleDateString()} - {new Date(invoice.period_end).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold">${invoice.total.toFixed(2)}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${invoice.status === "paid" ? "bg-green-100 text-green-800" : invoice.status === "overdue" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                {invoice.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
