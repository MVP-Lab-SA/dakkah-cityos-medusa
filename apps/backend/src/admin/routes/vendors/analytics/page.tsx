import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { ChartBar } from "@medusajs/icons"
import { useQuery } from "@tanstack/react-query"
import { client } from "../../../lib/client"
import { StatsGrid } from "../../../components/charts/stats-grid"

interface VendorStats {
  id: string
  store_name: string
  status: string
  commission_rate: string
  total_sales: string
  total_orders: number
  average_rating: string
  total_reviews: number
  total_paid_out: number
  pending_payouts: number
  payout_count: number
  created_at: string
}

interface PlatformStats {
  total_vendors: number
  active_vendors: number
  total_gmv: number
  total_orders: number
  total_paid_out: number
  pending_payouts: number
}

interface AnalyticsResponse {
  vendors: VendorStats[]
  platform_stats: PlatformStats
}

function useVendorAnalytics() {
  return useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: async () => {
      const { data } = await client.get<AnalyticsResponse>("/admin/vendors/analytics")
      return data
    },
  })
}

const VendorAnalyticsPage = () => {
  const { data, isLoading } = useVendorAnalytics()
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading analytics...</div>
  }
  
  if (!data) {
    return <div className="p-8 text-center">Failed to load analytics</div>
  }
  
  const { vendors, platform_stats } = data
  
  // Sort vendors by total sales
  const sortedVendors = [...vendors].sort(
    (a, b) => parseFloat(b.total_sales || "0") - parseFloat(a.total_sales || "0")
  )
  
  return (
    <div className="space-y-6">
      <div>
        <Heading>Vendor Analytics</Heading>
        <Text className="text-ui-fg-subtle">
          Platform-wide vendor performance metrics
        </Text>
      </div>
      
      <StatsGrid
        stats={[
          {
            label: "Total GMV",
            value: `$${platform_stats.total_gmv.toLocaleString()}`,
            color: "blue",
          },
          {
            label: "Total Orders",
            value: platform_stats.total_orders.toLocaleString(),
            color: "green",
          },
          {
            label: "Active Vendors",
            value: `${platform_stats.active_vendors} / ${platform_stats.total_vendors}`,
            color: "purple",
          },
          {
            label: "Total Paid Out",
            value: `$${platform_stats.total_paid_out.toLocaleString()}`,
            color: "orange",
          },
          {
            label: "Pending Payouts",
            value: `$${platform_stats.pending_payouts.toLocaleString()}`,
            color: "red",
          },
        ]}
      />
      
      <Container className="p-0">
        <div className="p-4 border-b">
          <Heading level="h2">Vendor Performance</Heading>
        </div>
        
        <table className="w-full">
          <thead className="border-b bg-ui-bg-subtle">
            <tr className="text-left text-ui-fg-subtle">
              <th className="p-4">Vendor</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Total Sales</th>
              <th className="p-4 text-right">Orders</th>
              <th className="p-4 text-right">Commission Rate</th>
              <th className="p-4 text-right">Rating</th>
              <th className="p-4 text-right">Paid Out</th>
              <th className="p-4 text-right">Pending</th>
            </tr>
          </thead>
          <tbody>
            {sortedVendors.map((vendor, index) => (
              <tr key={vendor.id} className="border-b hover:bg-ui-bg-subtle">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-ui-fg-muted w-6">#{index + 1}</span>
                    <Text className="font-medium">{vendor.store_name}</Text>
                  </div>
                </td>
                <td className="p-4">
                  <Badge color={vendor.status === "active" ? "green" : "grey"}>
                    {vendor.status}
                  </Badge>
                </td>
                <td className="p-4 text-right font-medium">
                  ${parseFloat(vendor.total_sales || "0").toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  {vendor.total_orders || 0}
                </td>
                <td className="p-4 text-right">
                  {parseFloat(vendor.commission_rate || "0")}%
                </td>
                <td className="p-4 text-right">
                  {vendor.average_rating ? (
                    <span>
                      {parseFloat(vendor.average_rating).toFixed(1)} ({vendor.total_reviews})
                    </span>
                  ) : (
                    <span className="text-ui-fg-muted">-</span>
                  )}
                </td>
                <td className="p-4 text-right text-ui-fg-success">
                  ${vendor.total_paid_out.toLocaleString()}
                </td>
                <td className="p-4 text-right text-ui-fg-warning">
                  ${vendor.pending_payouts.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {vendors.length === 0 && (
          <div className="p-8 text-center">
            <Text className="text-ui-fg-muted">No vendors found</Text>
          </div>
        )}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Vendor Analytics",
  icon: ChartBar,
})

export default VendorAnalyticsPage
