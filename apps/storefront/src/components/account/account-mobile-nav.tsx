import { Link, useLocation } from "@tanstack/react-router"
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  CreditCard,
  Adjustments
} from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"
import { useTenantPrefix } from "@/lib/context/tenant-context"

export function AccountMobileNav() {
  const location = useLocation()
  const prefix = useTenantPrefix()

  const navItems = [
    { label: "Home", href: `${prefix}/account`, icon: User },
    { label: "Orders", href: `${prefix}/account/orders`, icon: ShoppingBag },
    { label: "Subscriptions", href: `${prefix}/account/subscriptions`, icon: CreditCard },
    { label: "Addresses", href: `${prefix}/account/addresses`, icon: MapPin },
    { label: "Settings", href: `${prefix}/account/settings`, icon: Adjustments },
  ]

  const isActive = (href: string) => {
    if (href === `${prefix}/account`) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors",
              isActive(item.href)
                ? "text-zinc-900"
                : "text-zinc-400"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 mb-1",
              isActive(item.href) ? "text-zinc-900" : "text-zinc-400"
            )} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
