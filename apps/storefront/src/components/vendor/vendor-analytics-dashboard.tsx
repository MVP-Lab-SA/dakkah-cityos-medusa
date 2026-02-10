import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { ArrowUpMini, ArrowDownMini } from "@medusajs/icons"

interface AnalyticsData {
  summary: {
    total_revenue: number
    total_orders: number
    total_commission: number
    net_earnings: number
    average_order_value: number
  }
  trends: {
    revenue_change: number
    orders_change: number
  }
  top_products: Array<{
    product_id: string
    title: string
    units_sold: number
    revenue: number
  }>
  recent_orders: Array<{
    id: string
    display_id: number
    total: number
    status: string
    created_at: string
  }>
}

export function VendorAnalyticsDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: async () => {
      const response = await sdk.client.fetch<AnalyticsData>("/vendor/analytics", {
        credentials: "include",
      })
      return response
    },
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-ds-muted rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-ds-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const summary = data?.summary
  const trends = data?.trends

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-ds-foreground">
            {formatCurrency(summary?.total_revenue || 0)}
          </p>
          {trends?.revenue_change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trends.revenue_change >= 0 ? "text-ds-success" : "text-ds-destructive"
            }`}>
              {trends.revenue_change >= 0 ? (
                <ArrowUpMini className="w-4 h-4" />
              ) : (
                <ArrowDownMini className="w-4 h-4" />
              )}
              {formatPercent(trends.revenue_change)} vs last period
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-ds-foreground">
            {summary?.total_orders || 0}
          </p>
          {trends?.orders_change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trends.orders_change >= 0 ? "text-ds-success" : "text-ds-destructive"
            }`}>
              {trends.orders_change >= 0 ? (
                <ArrowUpMini className="w-4 h-4" />
              ) : (
                <ArrowDownMini className="w-4 h-4" />
              )}
              {formatPercent(trends.orders_change)} vs last period
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">Commission Paid</p>
          <p className="text-2xl font-bold text-ds-destructive">
            -{formatCurrency(summary?.total_commission || 0)}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-ds-muted-foreground mb-1">Net Earnings</p>
          <p className="text-2xl font-bold text-ds-success">
            {formatCurrency(summary?.net_earnings || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-ds-muted px-6 py-4 border-b">
            <h3 className="font-semibold text-ds-foreground">Top Products</h3>
          </div>
          {!data?.top_products || data.top_products.length === 0 ? (
            <div className="p-6 text-center text-ds-muted-foreground">
              No product data yet
            </div>
          ) : (
            <div className="divide-y">
              {data.top_products.map((product, index) => (
                <div key={product.product_id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-ds-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-ds-foreground">{product.title}</p>
                      <p className="text-sm text-ds-muted-foreground">{product.units_sold} units sold</p>
                    </div>
                  </div>
                  <p className="font-medium text-ds-foreground">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-ds-muted px-6 py-4 border-b">
            <h3 className="font-semibold text-ds-foreground">Recent Orders</h3>
          </div>
          {!data?.recent_orders || data.recent_orders.length === 0 ? (
            <div className="p-6 text-center text-ds-muted-foreground">
              No orders yet
            </div>
          ) : (
            <div className="divide-y">
              {data.recent_orders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ds-foreground">Order #{order.display_id}</p>
                    <p className="text-sm text-ds-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-medium text-ds-foreground">
                      {formatCurrency(order.total)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                      order.status === "completed" ? "bg-ds-success text-ds-success" :
                      order.status === "shipped" ? "bg-ds-info text-ds-info" :
                      "bg-ds-muted text-ds-foreground"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
