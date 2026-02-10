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
      href: `${prefix}/store`,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      label: "Reorder",
      description: "Quick reorder past items",
      href: `${prefix}/account/orders`,
      icon: ArrowPath,
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      label: "Track Order",
      description: "Check order status",
      href: `${prefix}/account/orders`,
      icon: Plus,
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      label: "Get Support",
      description: "Contact our team",
      href: `${prefix}/contact`,
      icon: ChatBubbleLeftRight,
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Quick Actions</h2>
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
