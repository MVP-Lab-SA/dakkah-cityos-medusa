import { type ReactNode } from "react"
import { Link, useLocation } from "@tanstack/react-router"
import { useTenantPrefix } from "@/lib/context/tenant-context"
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
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <p className="text-sm text-ds-muted-foreground">Loading account...</p>
      </div>
    )
  }

  return <ClientAccountLayout title={title} description={description}>{children}</ClientAccountLayout>
}

function ClientAccountLayout({ children, title, description }: AccountLayoutProps) {
  const location = useLocation()
  const prefix = useTenantPrefix()
  const baseHref = `${prefix}/account`
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
      <div className="min-h-screen bg-ds-muted">
        {/* Header */}
        <div className="bg-ds-background border-b border-ds-border">
          <div className="content-container py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ds-foreground">
                  {title || `Welcome back, ${customer?.first_name || "there"}`}
                </h1>
                {description && <p className="mt-1 text-ds-muted-foreground">{description}</p>}
              </div>
              {isB2B && customer?.company && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-ds-info rounded-lg">
                  <span className="text-sm font-medium text-ds-info">{customer.company.name}</span>
                  <span className="text-xs text-ds-info bg-ds-info px-2 py-0.5 rounded">
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
              <nav className="bg-ds-background rounded-lg border border-ds-border overflow-hidden">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={`${baseHref}${item.path}` as any}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-ds-border last:border-b-0",
                        active
                          ? "bg-ds-primary text-ds-primary-foreground"
                          : "text-ds-muted-foreground hover:bg-ds-muted hover:text-ds-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                      <ChevronRight
                        className={clsx("ml-auto h-4 w-4", active ? "text-ds-primary-foreground" : "text-ds-muted-foreground")}
                      />
                    </Link>
                  )
                })}
              </nav>

              {/* B2B Quick Access */}
              {isB2B && (
                <div className="mt-4 bg-ds-background rounded-lg border border-ds-border p-4">
                  <h3 className="text-sm font-semibold text-ds-foreground mb-3">Business</h3>
                  <div className="space-y-2">
                    <Link
                      to={`${prefix}/business` as any}
                      className="flex items-center gap-2 text-sm text-ds-muted-foreground hover:text-ds-foreground"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Company Dashboard
                    </Link>
                    <Link
                      to={`${prefix}/business/quotes` as any}
                      className="flex items-center gap-2 text-sm text-ds-muted-foreground hover:text-ds-foreground"
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
