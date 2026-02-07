import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { client } from "../lib/client"

type VendorStripeStatusProps = {
  vendor: {
    id: string
    stripe_account_id?: string
    stripe_onboarding_complete?: boolean
    stripe_payouts_enabled?: boolean
  }
}

const VendorStripeStatusWidget = ({ vendor }: VendorStripeStatusProps) => {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (vendor?.stripe_account_id) {
      fetchStatus()
    } else {
      setLoading(false)
    }
  }, [vendor?.stripe_account_id])

  const fetchStatus = async () => {
    try {
      const response = await client(`/admin/vendors/${vendor.id}/stripe-status`)
      setStatus(response)
    } catch (error) {
      console.error("Error fetching Stripe status:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="p-4">
        <Text>Loading Stripe status...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-4">
      <Heading level="h2" className="mb-4">Stripe Connect Status</Heading>
      
      {!vendor.stripe_account_id ? (
        <div className="space-y-2">
          <Badge color="grey">Not Connected</Badge>
          <Text className="text-ui-fg-subtle">
            This vendor has not set up Stripe Connect for payouts.
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Text className="font-medium">Account ID:</Text>
            <Text className="text-ui-fg-subtle">{vendor.stripe_account_id}</Text>
          </div>
          
          <div className="flex items-center gap-2">
            <Text className="font-medium">Onboarding:</Text>
            <Badge color={vendor.stripe_onboarding_complete ? "green" : "orange"}>
              {vendor.stripe_onboarding_complete ? "Complete" : "Pending"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Text className="font-medium">Payouts:</Text>
            <Badge color={vendor.stripe_payouts_enabled ? "green" : "red"}>
              {vendor.stripe_payouts_enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          {status?.requirements?.currently_due?.length > 0 && (
            <div className="mt-4 p-3 bg-ui-bg-subtle rounded-lg">
              <Text className="font-medium text-ui-fg-warning mb-2">
                Requirements Pending:
              </Text>
              <ul className="list-disc list-inside text-sm text-ui-fg-subtle">
                {status.requirements.currently_due.map((req: string) => (
                  <li key={req}>{req.replace(/_/g, " ")}</li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="secondary" size="small" onClick={fetchStatus}>
            Refresh Status
          </Button>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "vendor.details.after"
})

export default VendorStripeStatusWidget
