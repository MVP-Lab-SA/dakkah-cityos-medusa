import { useQuery } from "@tanstack/react-query"
import { sdk } from "~/lib/sdk"
import { formatPrice } from "~/lib/utils/prices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "@medusajs/icons"
import { Link } from "@tanstack/react-router"

export function VendorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "dashboard"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/vendor/dashboard", {
        credentials: "include",
      })
      return response.json()
    },
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const { vendor, stats, recentPayouts } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {vendor.business_name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalEarnings, vendor.currency_code || "USD")}
            </div>
            <p className="text-xs text-muted-foreground">
              After commission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.total_products}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                to="/$countryCode/vendor/products"
                className="text-primary hover:underline"
              >
                Manage products
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.pendingPayout, vendor.currency_code || "USD")}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for payout
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/$countryCode/vendor/products/new">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Add Product</CardTitle>
              <CardDescription>Create a new product listing</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/$countryCode/vendor/orders">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">View Orders</CardTitle>
              <CardDescription>Manage and fulfill orders</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/$countryCode/vendor/payouts">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Payouts</CardTitle>
              <CardDescription>View payment history</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Payouts */}
      {recentPayouts && recentPayouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>Your latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayouts.map((payout: any) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {formatPrice(payout.amount, payout.currency_code)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        payout.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payout.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {payout.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendor Status */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Verification Status</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                vendor.verification_status === "approved"
                  ? "bg-green-100 text-green-800"
                  : vendor.verification_status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {vendor.verification_status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account Status</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                vendor.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {vendor.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Commission Rate</span>
            <span className="text-sm font-medium">
              {vendor.commission_type === "percentage"
                ? `${vendor.commission_rate}%`
                : formatPrice(vendor.commission_flat, vendor.currency_code || "USD")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
