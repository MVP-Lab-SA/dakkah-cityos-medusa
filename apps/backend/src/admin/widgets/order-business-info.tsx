import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Heading, Text, Badge, Table } from "@medusajs/ui"
import { useState } from "react"

interface VendorOrderSplit {
  vendor_id: string
  vendor_name: string
  items_count: number
  subtotal: number
  commission: number
  payout: number
  status: string
}

interface B2BInfo {
  company_id: string
  company_name: string
  purchase_order_number?: string
  payment_terms?: string
  tax_exempt?: boolean
}

interface SubscriptionInfo {
  subscription_id: string
  plan_name: string
  billing_interval: string
  is_renewal?: boolean
}

interface BookingInfo {
  booking_id: string
  provider_name: string
  booking_date: string
  booking_time: string
}

const OrderBusinessInfoWidget = ({ data }: DetailWidgetProps<{ id: string }>) => {
  // Use useState to allow proper type inference
  const [vendorSplits] = useState<VendorOrderSplit[]>([])
  const [b2bInfo] = useState<B2BInfo | null>(null)
  const [subscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [bookingInfo] = useState<BookingInfo | null>(null)

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderB2BInfo = () => {
    if (!b2bInfo) return null
    return (
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">B2B Order</Text>
          <Badge size="2xsmall" color="purple">Company</Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Text size="small" className="text-ui-fg-subtle">Company</Text>
          <Text size="small">{b2bInfo.company_name}</Text>
          
          {b2bInfo.purchase_order_number && (
            <>
              <Text size="small" className="text-ui-fg-subtle">PO Number</Text>
              <Text size="small">{b2bInfo.purchase_order_number}</Text>
            </>
          )}
          
          {b2bInfo.payment_terms && (
            <>
              <Text size="small" className="text-ui-fg-subtle">Payment Terms</Text>
              <Text size="small">{b2bInfo.payment_terms}</Text>
            </>
          )}
          
          {b2bInfo.tax_exempt && (
            <>
              <Text size="small" className="text-ui-fg-subtle">Tax Status</Text>
              <Badge size="2xsmall" color="green">Tax Exempt</Badge>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderSubscriptionInfo = () => {
    if (!subscriptionInfo) return null
    return (
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Subscription Order</Text>
          <Badge size="2xsmall" color="green">Recurring</Badge>
          {subscriptionInfo.is_renewal && (
            <Badge size="2xsmall" color="blue">Renewal</Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Text size="small" className="text-ui-fg-subtle">Plan</Text>
          <Text size="small">{subscriptionInfo.plan_name}</Text>
          
          <Text size="small" className="text-ui-fg-subtle">Billing</Text>
          <Text size="small">{subscriptionInfo.billing_interval}</Text>
        </div>
      </div>
    )
  }

  const renderBookingInfo = () => {
    if (!bookingInfo) return null
    return (
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Service Booking</Text>
          <Badge size="2xsmall" color="orange">Appointment</Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <Text size="small" className="text-ui-fg-subtle">Provider</Text>
          <Text size="small">{bookingInfo.provider_name}</Text>
          
          <Text size="small" className="text-ui-fg-subtle">Date</Text>
          <Text size="small">{bookingInfo.booking_date}</Text>
          
          <Text size="small" className="text-ui-fg-subtle">Time</Text>
          <Text size="small">{bookingInfo.booking_time}</Text>
        </div>
      </div>
    )
  }

  const renderVendorSplits = () => {
    if (vendorSplits.length === 0) return null
    return (
      <div className="px-6 py-4">
        <div className="mb-3 flex items-center gap-x-2">
          <Text size="small" weight="plus">Vendor Split</Text>
          <Badge size="2xsmall" color="blue">Marketplace</Badge>
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Vendor</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Subtotal</Table.HeaderCell>
              <Table.HeaderCell>Commission</Table.HeaderCell>
              <Table.HeaderCell>Payout</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vendorSplits.map((split) => (
              <Table.Row key={split.vendor_id}>
                <Table.Cell>
                  <Text size="small">{split.vendor_name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{split.items_count}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{formatMoney(split.subtotal)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" className="text-ui-fg-error">
                    -{formatMoney(split.commission)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" weight="plus">
                    {formatMoney(split.payout)}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }

  const hasAnyInfo = b2bInfo || subscriptionInfo || bookingInfo || vendorSplits.length > 0

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Business Info</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Special business attributes for this order
        </Text>
      </div>

      {renderB2BInfo()}
      {renderSubscriptionInfo()}
      {renderBookingInfo()}
      {renderVendorSplits()}

      {!hasAnyInfo && (
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-muted">
            No special business attributes for this order
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderBusinessInfoWidget
