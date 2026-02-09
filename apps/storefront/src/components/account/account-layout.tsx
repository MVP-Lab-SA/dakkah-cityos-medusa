import { type ReactNode } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useAuth } from "@/lib/context/auth-context"
import { AuthGuard } from "@/components/auth"
import { clsx } from "clsx"
import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  Calendar,
  CogSixTooth,
  ChevronRight,
} from "@medusajs/icons"

interface AccountLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

const navItems = [
  { icon: User, label: "Overview", path: "" },
  { icon: ShoppingBag, label: "Orders", path: "/orders" },
  { icon: CreditCard, label: "Subscriptions", path: "/subscriptions" },
  { icon: Calendar, label: "Bookings", path: "/bookings" },
  { icon: MapPin, label: "Addresses", path: "/addresses" },
  { icon: CogSixTooth, label: "Settings", path: "/settings" },
]

export function AccountLayout({ children, title, description }: AccountLayoutProps) {
  if (typeof window === "undefined") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-sm text-zinc-500">Loading account...</p>
      </div>
    )
  }

  return <ClientAccountLayout title={title} description={description}>{children}</ClientAccountLayout>
}

function ClientAccountLayout({ children, title, description }: AccountLayoutProps) {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}/account` : "/account"
  const { customer, isB2B } = useAuth()

  const isActive = (path: string) => {
    const fullPath = `${baseHref}${path}`
    if (path === "") {
      return location.pathname === baseHref || location.pathname === `${baseHref}/`
    }
    return location.pathname.startsWith(fullPath)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50">
        {/* Header */}
        <div className="bg-white border-b border-zinc-200">
          <div className="content-container py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">
                  {title || `Welcome back, ${customer?.first_name || "there"}`}
                </h1>
                {description && <p className="mt-1 text-zinc-600">{description}</p>}
              </div>
              {isB2B && customer?.company && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">{customer.company.name}</span>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    Business
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="content-container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={`${baseHref}${item.path}` as any}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-zinc-100 last:border-b-0",
                        active
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                      <ChevronRight
                        className={clsx("ml-auto h-4 w-4", active ? "text-white" : "text-zinc-400")}
                      />
                    </Link>
                  )
                })}
              </nav>

              {/* B2B Quick Access */}
              {isB2B && (
                <div className="mt-4 bg-white rounded-lg border border-zinc-200 p-4">
                  <h3 className="text-sm font-semibold text-zinc-900 mb-3">Business</h3>
                  <div className="space-y-2">
                    <Link
                      to={`/${countryCode}/business` as any}
                      className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Company Dashboard
                    </Link>
                    <Link
                      to={`/${countryCode}/business/quotes` as any}
                      className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Quotes
                    </Link>
                  </div>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
