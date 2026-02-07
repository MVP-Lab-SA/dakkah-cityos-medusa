import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { ChartBar, CurrencyDollar, Buildings, ReceiptPercent, Calendar, ServerStack } from "@medusajs/icons"
import { useCompanies, usePurchaseOrders } from "../../hooks/use-companies"
import { useVendors, usePayouts } from "../../hooks/use-vendors"
import { useSubscriptions, useSubscriptionPlans } from "../../hooks/use-subscriptions"
import { useBookings, useServiceProviders } from "../../hooks/use-bookings"
import { useTenants } from "../../hooks/use-tenants"
import { StatsGrid } from "../../components/charts/stats-grid"

const AnalyticsPage = () => {
  const { data: companiesData } = useCompanies()
  const { data: posData } = usePurchaseOrders()
  const { data: vendorsData } = useVendors()
  const { data: payoutsData } = usePayouts()
  const { data: subscriptionsData } = useSubscriptions()
  const { data: plansData } = useSubscriptionPlans()
  const { data: bookingsData } = useBookings()
  const { data: providersData } = useServiceProviders()
  const { data: tenantsData } = useTenants()

  const companies = companiesData?.companies || []
  const purchaseOrders = posData?.purchase_orders || []
  const vendors = vendorsData?.vendors || []
  const payouts = payoutsData?.payouts || []
  const subscriptions = subscriptionsData?.subscriptions || []
  const plans = plansData?.plans || []
  const bookings = bookingsData?.bookings || []
  const providers = providersData?.providers || []
  const tenants = tenantsData?.tenants || []

  const subscriptionMRR = subscriptions
    .filter(s => s.status === "active" || s.status === "trialing")
    .reduce((sum, sub) => {
      const plan = plans.find(p => p.id === sub.plan_id)
      if (!plan) return sum
      return sum + (plan.billing_interval === "year" ? plan.price / 12 : plan.billing_interval === "month" ? plan.price : plan.price * 30)
    }, 0)

  const tenantPlanPrices: Record<string, number> = { free: 0, starter: 29, professional: 99, enterprise: 299 }
  const tenantMRR = tenants.filter(t => t.status === "active").reduce((sum, t) => sum + (tenantPlanPrices[t.plan] || 0), 0)
  const totalMRR = subscriptionMRR + tenantMRR

  const poTotal = purchaseOrders.reduce((sum, po) => sum + po.total, 0)
  const pendingPayouts = payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  const overviewStats = [
    { label: "Total MRR", value: `$${totalMRR.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const, change: 12.5, changeLabel: "vs last month" },
    { label: "Active Subscriptions", value: subscriptions.filter(s => s.status === "active").length, icon: <ReceiptPercent className="w-5 h-5" />, color: "blue" as const, change: 8.2, changeLabel: "vs last month" },
    { label: "Active Vendors", value: vendors.filter(v => v.status === "active").length, icon: <Buildings className="w-5 h-5" />, change: 5.0, changeLabel: "vs last month" },
    { label: "Active Tenants", value: tenants.filter(t => t.status === "active").length, icon: <ServerStack className="w-5 h-5" />, color: "purple" as const, change: 15.3, changeLabel: "vs last month" },
  ]

  const b2bStats = [
    { label: "Companies", value: companies.length, icon: <Buildings className="w-5 h-5" /> },
    { label: "Active", value: companies.filter(c => c.status === "active").length, color: "green" as const },
    { label: "PO Volume", value: `$${poTotal.toLocaleString()}` },
    { label: "Pending POs", value: purchaseOrders.filter(po => po.status === "pending_approval").length, color: "orange" as const },
  ]

  const marketplaceStats = [
    { label: "Vendors", value: vendors.length, icon: <Buildings className="w-5 h-5" /> },
    { label: "Active", value: vendors.filter(v => v.status === "active").length, color: "green" as const },
    { label: "Pending Payouts", value: `$${pendingPayouts.toLocaleString()}`, color: "orange" as const },
    { label: "Pending Approval", value: vendors.filter(v => v.status === "pending").length },
  ]

  const subscriptionStats = [
    { label: "MRR", value: `$${subscriptionMRR.toLocaleString()}`, icon: <CurrencyDollar className="w-5 h-5" />, color: "green" as const },
    { label: "Active", value: subscriptions.filter(s => s.status === "active").length, color: "green" as const },
    { label: "Trialing", value: subscriptions.filter(s => s.status === "trialing").length, color: "blue" as const },
    { label: "Plans", value: plans.filter(p => p.is_active).length },
  ]

  const bookingStats = [
    { label: "Total Bookings", value: bookings.length, icon: <Calendar className="w-5 h-5" /> },
    { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "green" as const },
    { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "orange" as const },
    { label: "Providers", value: providers.filter(p => p.is_active).length },
  ]

  const tenantStats = [
    { label: "Tenants", value: tenants.length, icon: <ServerStack className="w-5 h-5" /> },
    { label: "Active", value: tenants.filter(t => t.status === "active").length, color: "green" as const },
    { label: "Platform MRR", value: `$${tenantMRR.toLocaleString()}`, color: "green" as const },
    { label: "Enterprise", value: tenants.filter(t => t.plan === "enterprise").length, color: "purple" as const },
  ]

  const today = new Date().toISOString().split("T")[0]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div><Heading level="h1">Analytics Dashboard</Heading><Text className="text-ui-fg-muted">Platform-wide metrics and insights</Text></div>
      </div>

      <div className="p-6 space-y-8">
        <div><Heading level="h2" className="mb-4">Overview</Heading><StatsGrid stats={overviewStats} columns={4} /></div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-ui-bg-base rounded-lg border border-ui-border-base p-4">
            <div className="flex items-center gap-2 mb-4"><Buildings className="w-5 h-5 text-ui-fg-subtle" /><Heading level="h3">B2B Commerce</Heading></div>
            <StatsGrid stats={b2bStats} columns={2} />
          </div>

          <div className="bg-ui-bg-base rounded-lg border border-ui-border-base p-4">
            <div className="flex items-center gap-2 mb-4"><Buildings className="w-5 h-5 text-ui-fg-subtle" /><Heading level="h3">Marketplace</Heading></div>
            <StatsGrid stats={marketplaceStats} columns={2} />
          </div>

          <div className="bg-ui-bg-base rounded-lg border border-ui-border-base p-4">
            <div className="flex items-center gap-2 mb-4"><ReceiptPercent className="w-5 h-5 text-ui-fg-subtle" /><Heading level="h3">Subscriptions</Heading></div>
            <StatsGrid stats={subscriptionStats} columns={2} />
          </div>

          <div className="bg-ui-bg-base rounded-lg border border-ui-border-base p-4">
            <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-ui-fg-subtle" /><Heading level="h3">Bookings</Heading></div>
            <StatsGrid stats={bookingStats} columns={2} />
          </div>
        </div>

        <div className="bg-ui-bg-base rounded-lg border border-ui-border-base p-4">
          <div className="flex items-center gap-2 mb-4"><ServerStack className="w-5 h-5 text-ui-fg-subtle" /><Heading level="h3">Multi-Tenant Platform</Heading></div>
          <StatsGrid stats={tenantStats} columns={4} />
        </div>

        <div className="bg-ui-bg-subtle rounded-lg p-6">
          <Heading level="h3" className="mb-4">Quick Insights</Heading>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-ui-bg-base rounded-lg p-4 border border-ui-border-base">
              <Text className="text-ui-fg-muted text-sm">Pending Approvals</Text>
              <div className="flex items-center gap-2 mt-2">
                <Text className="text-2xl font-semibold">{vendors.filter(v => v.status === "pending").length + purchaseOrders.filter(po => po.status === "pending_approval").length}</Text>
                <Badge color="orange">Needs action</Badge>
              </div>
            </div>
            <div className="bg-ui-bg-base rounded-lg p-4 border border-ui-border-base">
              <Text className="text-ui-fg-muted text-sm">Today's Bookings</Text>
              <div className="flex items-center gap-2 mt-2">
                <Text className="text-2xl font-semibold">{bookings.filter(b => b.booking_date === today).length}</Text>
                <Badge color="blue">Scheduled</Badge>
              </div>
            </div>
            <div className="bg-ui-bg-base rounded-lg p-4 border border-ui-border-base">
              <Text className="text-ui-fg-muted text-sm">Churn Risk</Text>
              <div className="flex items-center gap-2 mt-2">
                <Text className="text-2xl font-semibold">{subscriptions.filter(s => s.status === "past_due").length + tenants.filter(t => t.status === "suspended").length}</Text>
                <Badge color="red">At risk</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Analytics", icon: ChartBar })
export default AnalyticsPage
