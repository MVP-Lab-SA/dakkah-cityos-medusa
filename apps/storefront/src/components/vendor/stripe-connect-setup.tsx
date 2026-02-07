import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { Button } from "@/components/ui/button"
import { CheckCircleSolid, ExclamationCircle, ArrowUpRightOnBox } from "@medusajs/icons"

interface StripeConnectSetupProps {
  vendorId: string
}

export function StripeConnectSetup({ vendorId }: StripeConnectSetupProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Check current Stripe Connect status
  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ["vendor-stripe-status", vendorId],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        has_stripe_account: boolean
        stripe_account_id?: string
        charges_enabled: boolean
        payouts_enabled: boolean
        details_submitted: boolean
        requirements?: {
          currently_due: string[]
          eventually_due: string[]
        }
      }>(`/store/vendors/${vendorId}/stripe-connect/status`, {
        credentials: "include",
      })
      return response
    },
  })

  // Start onboarding mutation
  const onboardMutation = useMutation({
    mutationFn: async () => {
      const response = await sdk.client.fetch<{
        onboarding_url: string
      }>(`/store/vendors/${vendorId}/stripe-connect`, {
        method: "POST",
        credentials: "include",
        body: {
          return_url: window.location.href,
          refresh_url: window.location.href,
        },
      })
      return response
    },
    onSuccess: (data) => {
      setIsRedirecting(true)
      window.location.href = data.onboarding_url
    },
  })

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-zinc-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-zinc-200 rounded w-2/3"></div>
      </div>
    )
  }

  const isFullyOnboarded = status?.charges_enabled && status?.payouts_enabled
  const hasPartialSetup = status?.has_stripe_account && !isFullyOnboarded

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-zinc-50 px-6 py-4 border-b">
        <h3 className="font-semibold text-zinc-900">Payment Setup</h3>
        <p className="text-sm text-zinc-500 mt-1">
          Connect your bank account to receive payouts
        </p>
      </div>

      <div className="p-6">
        {isFullyOnboarded ? (
          <div className="flex items-start gap-3">
            <CheckCircleSolid className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Payment setup complete</p>
              <p className="text-sm text-zinc-600 mt-1">
                Your account is fully configured to receive payouts. Earnings will be 
                automatically transferred to your bank account.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => onboardMutation.mutate()}
                disabled={onboardMutation.isPending || isRedirecting}
              >
                <ArrowUpRightOnBox className="w-4 h-4 mr-2" />
                Manage Payment Settings
              </Button>
            </div>
          </div>
        ) : hasPartialSetup ? (
          <div className="flex items-start gap-3">
            <ExclamationCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Setup incomplete</p>
              <p className="text-sm text-zinc-600 mt-1">
                Your payment account setup is incomplete. Please complete the remaining 
                steps to start receiving payouts.
              </p>
              {status?.requirements?.currently_due && status.requirements.currently_due.length > 0 && (
                <div className="mt-3 text-sm text-zinc-500">
                  <p className="font-medium">Required information:</p>
                  <ul className="list-disc ml-4 mt-1">
                    {status.requirements.currently_due.slice(0, 3).map((req) => (
                      <li key={req}>{req.replace(/_/g, " ")}</li>
                    ))}
                    {status.requirements.currently_due.length > 3 && (
                      <li>And {status.requirements.currently_due.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}
              <Button
                className="mt-4"
                onClick={() => onboardMutation.mutate()}
                disabled={onboardMutation.isPending || isRedirecting}
              >
                {isRedirecting ? "Redirecting..." : "Complete Setup"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-zinc-300 mt-0.5" />
            <div>
              <p className="font-medium text-zinc-900">Connect your bank account</p>
              <p className="text-sm text-zinc-600 mt-1">
                To receive payouts for your sales, you need to set up a Stripe Connect 
                account. This is a secure way to receive payments directly to your bank.
              </p>
              <ul className="text-sm text-zinc-500 mt-3 space-y-1">
                <li>- Secure bank account connection</li>
                <li>- Automatic payout processing</li>
                <li>- Detailed earning reports</li>
              </ul>
              <Button
                className="mt-4"
                onClick={() => onboardMutation.mutate()}
                disabled={onboardMutation.isPending || isRedirecting}
              >
                {isRedirecting ? "Redirecting to Stripe..." : "Set Up Payments"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
