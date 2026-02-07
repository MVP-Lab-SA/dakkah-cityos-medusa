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

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

interface AccountSidebarProps {
  countryCode: string
}

export function AccountSidebar({ countryCode }: AccountSidebarProps) {
  const location = useLocation()
  const { customer, isB2B, logout } = useAuth()

  const mainNavItems: NavItem[] = [
    { label: "Dashboard", href: `/${countryCode}/account`, icon: User },
    { label: "Orders", href: `/${countryCode}/account/orders`, icon: ShoppingBag },
    { label: "Subscriptions", href: `/${countryCode}/account/subscriptions`, icon: CreditCard },
    { label: "Bookings", href: `/${countryCode}/account/bookings`, icon: Calendar },
    { label: "Addresses", href: `/${countryCode}/account/addresses`, icon: MapPin },
  ]

  const b2bNavItems: NavItem[] = isB2B ? [
    { label: "Purchase Orders", href: `/${countryCode}/account/purchase-orders`, icon: DocumentText },
    { label: "Company", href: `/${countryCode}/business/team`, icon: BuildingStorefront },
  ] : []

  const settingsNavItems: NavItem[] = [
    { label: "Settings", href: `/${countryCode}/account/settings`, icon: CogSixTooth },
  ]

  const isActive = (href: string) => {
    if (href === `/${countryCode}/account`) {
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
          ? "bg-zinc-900 text-white"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      )}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-zinc-200 text-zinc-700 text-xs px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  )

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24">
        {/* User Info */}
        <div className="mb-6 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-semibold">
              {customer?.first_name?.[0]?.toUpperCase() || customer?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-zinc-900">
                {customer?.first_name ? `${customer.first_name} ${customer.last_name || ""}`.trim() : "User"}
              </p>
              <p className="text-sm text-zinc-500">{customer?.email}</p>
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
            <div className="my-4 border-t border-zinc-200" />
            <p className="px-4 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
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
        <div className="my-4 border-t border-zinc-200" />
        <nav className="space-y-1">
          {settingsNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <ArrowRightOnRectangle className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
