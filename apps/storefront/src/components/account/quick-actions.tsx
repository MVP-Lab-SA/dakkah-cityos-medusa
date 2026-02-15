import { Link } from "@tanstack/react-router"
import { 
  ArrowPath, 
  ShoppingBag,
  ChatBubbleLeftRight,
  Gift,
  Plus
} from "@medusajs/icons"
import { useTenantPrefix } from "@/lib/context/tenant-context"

export function QuickActions() {
  const prefix = useTenantPrefix()

  const actions = [
    {
      label: "Browse Products",
      description: "Continue shopping",
      href: `${prefix}/`,
      icon: ShoppingBag,
      color: "bg-ds-info text-ds-info hover:bg-ds-info",
    },
    {
      label: "Reorder",
      description: "Quick reorder past items",
      href: `${prefix}/account/orders`,
      icon: ArrowPath,
      color: "bg-ds-success text-ds-success hover:bg-ds-success",
    },
    {
      label: "Track Order",
      description: "Check order status",
      href: `${prefix}/account/orders`,
      icon: Plus,
      color: "bg-ds-accent/10 text-ds-accent hover:bg-ds-accent/10",
    },
    {
      label: "Get Support",
      description: "Contact our team",
      href: `${prefix}/help`,
      icon: ChatBubbleLeftRight,
      color: "bg-ds-warning/10 text-ds-warning hover:bg-ds-warning/15",
    },
  ]

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <h2 className="text-lg font-semibold text-ds-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${action.color}`}
          >
            <action.icon className="w-5 h-5" />
            <div>
              <p className="font-medium text-sm">{action.label}</p>
              <p className="text-xs opacity-75">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
