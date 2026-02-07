import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useState } from "react"

interface Company {
  id: string
  name: string
  tier: string
  credit_limit: number
  credit_balance: number
  payment_terms_days: number
}

interface Subscription {
  id: string
  plan_name: string
  status: string
  next_billing_date: string
  amount: number
}

interface Booking {
  id: string
  provider_name: string
  booking_date: string
  status: string
}

const CustomerBusinessInfoWidget = ({ data }: DetailWidgetProps<{ id: string }>) => {
  // Use useState to allow proper type inference
  const [company] = useState<Company | null>(null)
  const [subscriptions] = useState<Subscription[]>([])
  const [upcomingBookings] = useState<Booking[]>([])

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  const getTierColor = (tier: string): "purple" | "orange" | "grey" | "blue" => {
    switch (tier) {
      case "platinum": return "purple"
      case "gold": return "orange"
      case "silver": return "grey"
      default: return "blue"
    }
  }

  const getStatusColor = (status: string): "green" | "orange" | "red" | "grey" => {
    switch (status) {
      case "active": return "green"
      case "confirmed": return "green"
      case "pending": return "orange"
      case "cancelled": return "red"
      default: return "grey"
    }
  }

  const renderCompanyInfo = () => {
    if (!company) return null
    return (
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">B2B Company</Text>
          <Badge size="2xsmall" color={getTierColor(company.tier)}>
            {company.tier}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Text size="small" className="text-ui-fg-subtle">Company</Text>
          <Text size="small">{company.name}</Text>
          
          <Text size="small" className="text-ui-fg-subtle">Credit Limit</Text>
          <Text size="small">{formatMoney(company.credit_limit)}</Text>
          
          <Text size="small" className="text-ui-fg-subtle">Credit Used</Text>
          <Text size="small" className={company.credit_balance > company.credit_limit * 0.8 ? "text-ui-fg-error" : ""}>
            {formatMoney(company.credit_balance)}
          </Text>
          
          <Text size="small" className="text-ui-fg-subtle">Payment Terms</Text>
          <Text size="small">Net {company.payment_terms_days}</Text>
        </div>
      </div>
    )
  }

  const renderSubscriptions = () => {
    if (subscriptions.length === 0) return null
    return (
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Active Subscriptions</Text>
          <Badge size="2xsmall" color="green">{subscriptions.length}</Badge>
        </div>
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between rounded border border-ui-border-base p-3">
              <div>
                <Text size="small" weight="plus">{sub.plan_name}</Text>
                <Text size="xsmall" className="text-ui-fg-subtle">
                  Next billing: {formatDate(sub.next_billing_date)}
                </Text>
              </div>
              <div className="text-right">
                <Badge size="2xsmall" color={getStatusColor(sub.status)}>
                  {sub.status}
                </Badge>
                <Text size="small" className="mt-1">
                  {formatMoney(sub.amount)}/mo
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderBookings = () => {
    if (upcomingBookings.length === 0) return null
    return (
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Upcoming Bookings</Text>
          <Badge size="2xsmall" color="orange">{upcomingBookings.length}</Badge>
        </div>
        <div className="space-y-3">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between rounded border border-ui-border-base p-3">
              <div>
                <Text size="small" weight="plus">{booking.provider_name}</Text>
                <Text size="xsmall" className="text-ui-fg-subtle">
                  {formatDate(booking.booking_date)}
                </Text>
              </div>
              <Badge size="2xsmall" color={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const hasAnyInfo = company || subscriptions.length > 0 || upcomingBookings.length > 0

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Business Profile</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Customer's business associations and activity
        </Text>
      </div>

      {renderCompanyInfo()}
      {renderSubscriptions()}
      {renderBookings()}

      {!hasAnyInfo && (
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-muted">
            No business associations for this customer
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.after",
})

export default CustomerBusinessInfoWidget
