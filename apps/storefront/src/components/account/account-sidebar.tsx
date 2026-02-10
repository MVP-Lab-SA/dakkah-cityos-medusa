import { Link, useLocation } from "@tanstack/react-router"
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  CogSixTooth, 
  ArrowRightOnRectangle,
  Calendar,
  BuildingStorefront,
  DocumentText
} from "@medusajs/icons"
import { useAuth } from "@/lib/context/auth-context"
import { cn } from "@/lib/utils/cn"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

export function AccountSidebar() {
  const location = useLocation()
  const { customer, isB2B, logout } = useAuth()
  const prefix = useTenantPrefix()

  const mainNavItems: NavItem[] = [
    { label: "Dashboard", href: `${prefix}/account`, icon: User },
    { label: "Orders", href: `${prefix}/account/orders`, icon: ShoppingBag },
    { label: "Subscriptions", href: `${prefix}/account/subscriptions`, icon: CreditCard },
    { label: "Bookings", href: `${prefix}/account/bookings`, icon: Calendar },
    { label: "Addresses", href: `${prefix}/account/addresses`, icon: MapPin },
  ]

  const b2bNavItems: NavItem[] = isB2B ? [
    { label: "Purchase Orders", href: `${prefix}/account/purchase-orders`, icon: DocumentText },
    { label: "Company", href: `${prefix}/business/team`, icon: BuildingStorefront },
  ] : []

  const settingsNavItems: NavItem[] = [
    { label: "Settings", href: `${prefix}/account/settings`, icon: CogSixTooth },
  ]

  const isActive = (href: string) => {
    if (href === `${prefix}/account`) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
        isActive(item.href)
          ? "bg-ds-primary text-ds-primary-foreground"
          : "text-ds-muted-foreground hover:bg-ds-muted hover:text-ds-foreground"
      )}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-ds-muted text-ds-foreground text-xs px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  )

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24">
        {/* User Info */}
        <div className="mb-6 pb-6 border-b border-ds-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-ds-primary text-ds-primary-foreground flex items-center justify-center text-lg font-semibold">
              {customer?.first_name?.[0]?.toUpperCase() || customer?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-ds-foreground">
                {customer?.first_name ? `${customer.first_name} ${customer.last_name || ""}`.trim() : "User"}
              </p>
              <p className="text-sm text-ds-muted-foreground">{customer?.email}</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* B2B Navigation */}
        {b2bNavItems.length > 0 && (
          <>
            <div className="my-4 border-t border-ds-border" />
            <p className="px-4 mb-2 text-xs font-semibold text-ds-muted-foreground uppercase tracking-wider">
              Business
            </p>
            <nav className="space-y-1">
              {b2bNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </>
        )}

        {/* Settings */}
        <div className="my-4 border-t border-ds-border" />
        <nav className="space-y-1">
          {settingsNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-ds-destructive hover:bg-ds-destructive transition-colors w-full"
          >
            <ArrowRightOnRectangle className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
