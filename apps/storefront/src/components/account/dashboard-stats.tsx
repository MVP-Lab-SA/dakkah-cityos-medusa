import { ShoppingBag, CreditCard, Calendar, TruckFast } from "@medusajs/icons"

interface DashboardStatsProps {
  orderCount: number
  subscriptionCount: number
  bookingCount: number
  pendingShipments: number
}

export function DashboardStats({
  orderCount,
  subscriptionCount,
  bookingCount,
  pendingShipments,
}: DashboardStatsProps) {
  const stats = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: orderCount,
      color: "bg-ds-info text-ds-info",
    },
    {
      icon: CreditCard,
      label: "Active Subscriptions",
      value: subscriptionCount,
      color: "bg-ds-success text-ds-success",
    },
    {
      icon: Calendar,
      label: "Upcoming Bookings",
      value: bookingCount,
      color: "bg-ds-accent/10 text-ds-accent",
    },
    {
      icon: TruckFast,
      label: "Pending Shipments",
      value: pendingShipments,
      color: "bg-ds-warning/10 text-ds-warning",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-ds-background rounded-lg border border-ds-border p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ds-foreground">{stat.value}</p>
              <p className="text-sm text-ds-muted-foreground">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
