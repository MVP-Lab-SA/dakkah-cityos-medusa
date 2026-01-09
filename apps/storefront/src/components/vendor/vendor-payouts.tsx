import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "~/lib/sdk"
import { formatPrice } from "~/lib/utils/prices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { toast } from "sonner"

export function VendorPayouts() {
  const queryClient = useQueryClient()

  const { data: dashboardData } = useQuery({
    queryKey: ["vendor", "dashboard"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/vendor/dashboard", {
        credentials: "include",
      })
      return response.json()
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "payouts"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/vendor/payouts", {
        credentials: "include",
      })
      return response.json()
    },
  })

  const requestPayoutMutation = useMutation({
    mutationFn: async () => {
      const response = await sdk.client.fetch("/vendor/payouts/request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to request payout")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "payouts"] })
      queryClient.invalidateQueries({ queryKey: ["vendor", "dashboard"] })
      toast.success("Payout request submitted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to request payout")
    },
  })

  if (isLoading) {
    return <PayoutsSkeleton />
  }

  const { payouts } = data
  const pendingPayout = dashboardData?.stats?.pendingPayout || 0
  const vendor = dashboardData?.vendor

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground mt-2">
          Manage your payout requests and history
        </p>
      </div>

      {/* Pending Payout Card */}
      <Card>
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
          <CardDescription>
            Your current balance available for payout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">
                {formatPrice(pendingPayout, vendor?.currency_code || "USD")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Minimum payout: {formatPrice(vendor?.payout_minimum || 5000, vendor?.currency_code || "USD")}
              </p>
            </div>
            <Button
              onClick={() => requestPayoutMutation.mutate()}
              disabled={
                requestPayoutMutation.isPending ||
                pendingPayout < (vendor?.payout_minimum || 5000)
              }
            >
              Request Payout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>Your recent payout transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No payouts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout: any) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {formatPrice(payout.amount, payout.currency_code)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payout.created_at).toLocaleDateString()} -{" "}
                      {payout.payout_method}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        payout.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payout.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : payout.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payout.status}
                    </span>
                    {payout.completed_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Completed: {new Date(payout.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PayoutsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
