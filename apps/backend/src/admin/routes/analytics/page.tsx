import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { ChartBar, ArrowUpRightMini, ArrowDownRightMini } from "@medusajs/icons"

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    trend: "up" | "down" | "flat"
  }
  orders: {
    total: number
    change: number
    trend: "up" | "down" | "flat"
  }
  customers: {
    total: number
    change: number
    trend: "up" | "down" | "flat"
  }
  vendors: {
    total: number
    pending: number
    active: number
  }
  subscriptions: {
    active: number
    mrr: number
    churn: number
  }
  bookings: {
    total: number
    today: number
    pending: number
  }
  companies: {
    total: number
    active: number
  }
  tenants: {
    total: number
    active: number
    mrr: number
  }
}

const StatsCard = ({
  title,
  value,
  change,
  trend,
  subtitle,
}: {
  title: string
  value: string
  change?: number
  trend?: "up" | "down" | "flat"
  subtitle?: string
}) => (
  <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-4">
    <Text size="small" className="text-ui-fg-subtle mb-1">
      {title}
    </Text>
    <div className="flex items-baseline gap-x-2">
      <Heading level="h2">{value}</Heading>
      {change !== undefined && trend && (
        <div
          className={`flex items-center text-sm ${
            trend === "up"
              ? "text-ui-fg-success"
              : trend === "down"
              ? "text-ui-fg-error"
              : "text-ui-fg-subtle"
          }`}
        >
          {trend === "up" && <ArrowUpRightMini />}
          {trend === "down" && <ArrowDownRightMini />}
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
    {subtitle && (
      <Text size="xsmall" className="text-ui-fg-muted mt-1">
        {subtitle}
      </Text>
    )}
  </div>
)

const AnalyticsPage = () => {
  const { data: vendorsData } = useQuery({
    queryKey: ["analytics-vendors"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ vendors: any[]; count: number }>(
        "/admin/vendors",
        { credentials: "include" }
      )
      return response
    },
  })

  const { data: subscriptionsData } = useQuery({
    queryKey: ["analytics-subscriptions"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ subscriptions: any[]; count: number }>(
        "/admin/subscriptions",
        { credentials: "include" }
      )
      return response
    },
  })

  const { data: bookingsData } = useQuery({
    queryKey: ["analytics-bookings"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ bookings: any[]; count: number }>(
        "/admin/bookings",
        { credentials: "include" }
      )
      return response
    },
  })

  const { data: companiesData } = useQuery({
    queryKey: ["analytics-companies"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ companies: any[]; count: number }>(
        "/admin/companies",
        { credentials: "include" }
      )
      return response
    },
  })

  const { data: tenantsData } = useQuery({
    queryKey: ["analytics-tenants"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ tenants: any[]; count: number }>(
        "/admin/tenants",
        { credentials: "include" }
      )
      return response
    },
  })

  const vendors = vendorsData?.vendors || []
  const subscriptions = subscriptionsData?.subscriptions || []
  const bookings = bookingsData?.bookings || []
  const companies = companiesData?.companies || []
  const tenants = tenantsData?.tenants || []

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate metrics
  const activeVendors = vendors.filter((v) => v.verification_status === "approved").length
  const pendingVendors = vendors.filter((v) => v.verification_status === "pending").length

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length
  const subscriptionMRR = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.amount || 0), 0)

  const todayBookings = bookings.filter((b) => {
    const today = new Date().toDateString()
    return new Date(b.booking_date).toDateString() === today
  }).length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length

  const activeCompanies = companies.filter((c) => c.status === "active").length

  const activeTenants = tenants.filter((t) => t.status === "active").length
  const tenantMRR = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + (t.monthly_revenue || 0), 0)

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">Platform Analytics</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Overview of all business metrics across all modules
        </Text>
      </div>

      {/* Marketplace Stats */}
      <div className="px-6 py-4">
        <div className="mb-4 flex items-center gap-x-2">
          <Heading level="h2">Marketplace</Heading>
          <Badge size="2xsmall" color="blue">
            Vendors
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Vendors"
            value={vendors.length.toString()}
            subtitle={`${activeVendors} active, ${pendingVendors} pending`}
          />
          <StatsCard
            title="Active Vendors"
            value={activeVendors.toString()}
            change={12}
            trend="up"
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingVendors.toString()}
            subtitle="Awaiting review"
          />
          <StatsCard
            title="Total Sales (Vendors)"
            value={formatMoney(
              vendors.reduce((sum, v) => sum + (v.total_sales || 0), 0)
            )}
            change={8}
            trend="up"
          />
        </div>
      </div>

      {/* Subscription Stats */}
      <div className="px-6 py-4">
        <div className="mb-4 flex items-center gap-x-2">
          <Heading level="h2">Subscriptions</Heading>
          <Badge size="2xsmall" color="green">
            Recurring
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Subscriptions"
            value={subscriptions.length.toString()}
            subtitle={`${activeSubscriptions} active`}
          />
          <StatsCard
            title="Active Subscriptions"
            value={activeSubscriptions.toString()}
            change={5}
            trend="up"
          />
          <StatsCard
            title="Monthly Recurring Revenue"
            value={formatMoney(subscriptionMRR)}
            change={15}
            trend="up"
          />
          <StatsCard
            title="Annual Run Rate"
            value={formatMoney(subscriptionMRR * 12)}
            subtitle="Projected ARR"
          />
        </div>
      </div>

      {/* Booking Stats */}
      <div className="px-6 py-4">
        <div className="mb-4 flex items-center gap-x-2">
          <Heading level="h2">Bookings</Heading>
          <Badge size="2xsmall" color="orange">
            Services
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Bookings"
            value={bookings.length.toString()}
          />
          <StatsCard
            title="Today's Bookings"
            value={todayBookings.toString()}
            subtitle="Scheduled for today"
          />
          <StatsCard
            title="Pending Confirmation"
            value={pendingBookings.toString()}
            subtitle="Need attention"
          />
          <StatsCard
            title="Booking Revenue"
            value={formatMoney(
              bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
            )}
          />
        </div>
      </div>

      {/* B2B Stats */}
      <div className="px-6 py-4">
        <div className="mb-4 flex items-center gap-x-2">
          <Heading level="h2">B2B Commerce</Heading>
          <Badge size="2xsmall" color="purple">
            Companies
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Companies"
            value={companies.length.toString()}
            subtitle={`${activeCompanies} active`}
          />
          <StatsCard
            title="Active Companies"
            value={activeCompanies.toString()}
            change={3}
            trend="up"
          />
          <StatsCard
            title="Total Credit Extended"
            value={formatMoney(
              companies.reduce((sum, c) => sum + (c.credit_limit || 0), 0)
            )}
          />
          <StatsCard
            title="Outstanding Balance"
            value={formatMoney(
              companies.reduce((sum, c) => sum + (c.credit_balance || 0), 0)
            )}
          />
        </div>
      </div>

      {/* Multi-Tenant Stats */}
      <div className="px-6 py-4">
        <div className="mb-4 flex items-center gap-x-2">
          <Heading level="h2">Multi-Tenant Platform</Heading>
          <Badge size="2xsmall" color="grey">
            SaaS
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tenants"
            value={tenants.length.toString()}
            subtitle={`${activeTenants} active`}
          />
          <StatsCard
            title="Active Tenants"
            value={activeTenants.toString()}
            change={10}
            trend="up"
          />
          <StatsCard
            title="Platform MRR"
            value={formatMoney(tenantMRR)}
            change={20}
            trend="up"
          />
          <StatsCard
            title="Platform ARR"
            value={formatMoney(tenantMRR * 12)}
            subtitle="Projected annual"
          />
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Analytics",
  icon: ChartBar,
})

export default AnalyticsPage
