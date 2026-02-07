import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation } from "@tanstack/react-query"
import { CheckCircleSolid, ExclamationCircleSolid } from "@medusajs/icons"

export const Route = createFileRoute("/vendor/settings/payments")({
  component: VendorPaymentSettingsPage,
})

function useVendorProfile() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch profile")
      const data = await response.json()
      return data.vendor
    },
  })
}

function useConnectStripe() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me/connect-stripe`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to connect Stripe")
      const data = await response.json()
      return data
    },
  })
}

function useStripeLoginLink() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me/stripe-dashboard`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to get dashboard link")
      const data = await response.json()
      return data
    },
  })
}

function VendorPaymentSettingsPage() {
  const { data: vendor, isLoading } = useVendorProfile()
  const connectStripe = useConnectStripe()
  const stripeLogin = useStripeLoginLink()

  const handleConnectStripe = async () => {
    try {
      const result = await connectStripe.mutateAsync()
      if (result.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error("Failed to connect Stripe:", err)
    }
  }

  const handleStripeDashboard = async () => {
    try {
      const result = await stripeLogin.mutateAsync()
      if (result.url) {
        window.open(result.url, "_blank")
      }
    } catch (err) {
      console.error("Failed to open dashboard:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const stripeConnected = vendor?.stripe_account_id && vendor?.stripe_charges_enabled

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
        <p className="text-gray-600 mt-1">Manage how you receive payments</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <Link to="/vendor/settings" className="px-4 py-2 text-gray-600 hover:text-gray-900">
          General
        </Link>
        <Link
          to="/vendor/settings/payments"
          className="px-4 py-2 border-b-2 border-black font-medium"
        >
          Payments
        </Link>
      </div>

      <div className="space-y-8">
        {/* Stripe Connect */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Stripe Connect</h2>
              <p className="text-gray-600 mb-4">
                Connect your Stripe account to receive payouts directly to your bank account.
              </p>

              {stripeConnected ? (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircleSolid className="w-5 h-5" />
                  <span className="font-medium">Connected</span>
                </div>
              ) : vendor?.stripe_account_id ? (
                <div className="flex items-center gap-2 text-yellow-600 mb-4">
                  <ExclamationCircleSolid className="w-5 h-5" />
                  <span className="font-medium">Setup incomplete</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <ExclamationCircleSolid className="w-5 h-5" />
                  <span className="font-medium">Not connected</span>
                </div>
              )}
            </div>

            <img src="/stripe-logo.svg" alt="Stripe" className="h-8 opacity-50" />
          </div>

          <div className="flex gap-4">
            {stripeConnected ? (
              <button
                onClick={handleStripeDashboard}
                disabled={stripeLogin.isPending}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {stripeLogin.isPending ? "Loading..." : "View Stripe Dashboard"}
              </button>
            ) : (
              <button
                onClick={handleConnectStripe}
                disabled={connectStripe.isPending}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {connectStripe.isPending ? "Connecting..." : "Connect with Stripe"}
              </button>
            )}
          </div>
        </div>

        {/* Payout Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Payout Schedule</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Payout Frequency</p>
                <p className="text-sm text-gray-600">How often you receive payouts</p>
              </div>
              <span className="text-gray-900 capitalize">{vendor?.payout_schedule || "Weekly"}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Minimum Payout</p>
                <p className="text-sm text-gray-600">Minimum balance required for payout</p>
              </div>
              <span className="text-gray-900">
                ${((vendor?.payout_minimum || 5000) / 100).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Commission Rate</p>
                <p className="text-sm text-gray-600">Platform fee on each sale</p>
              </div>
              <span className="text-gray-900">{vendor?.commission_rate || 15}%</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Payout Method</h2>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border">
              <span className="text-2xl">🏦</span>
            </div>
            <div>
              <p className="font-medium">
                {vendor?.payout_method === "stripe_connect" ? "Stripe Connect" : "Bank Transfer"}
              </p>
              <p className="text-sm text-gray-600">
                Payments are deposited directly to your connected account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
