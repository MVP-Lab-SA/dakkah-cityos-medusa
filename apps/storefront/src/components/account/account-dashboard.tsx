import { Link } from "@tanstack/react-router"
import { useFeatures } from "../../lib/context/feature-context"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import { 
  ShoppingBag,
  User,
  CreditCard,
  Star,
  Buildings,
  Calendar,
  MapPin,
  DocumentText,
  ArrowRightMini
} from "@medusajs/icons"

interface AccountDashboardProps {
  customer: {
    first_name?: string
    last_name?: string
    email: string
  }
  stats?: {
    orderCount?: number
    wishlistCount?: number
    reviewCount?: number
  }
}

interface DashboardLink {
  label: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  feature?: string
}

export function AccountDashboard({ customer, stats }: AccountDashboardProps) {
  const { isEnabled } = useFeatures()
  const prefix = useTenantPrefix()

  const dashboardLinks: DashboardLink[] = [
    {
      label: "Orders",
      description: "View and track your orders",
      href: `${prefix}/account/orders`,
      icon: ShoppingBag
    },
    {
      label: "Profile",
      description: "Manage your account details",
      href: `${prefix}/account/profile`,
      icon: User
    },
    {
      label: "Addresses",
      description: "Manage shipping addresses",
      href: `${prefix}/account/addresses`,
      icon: MapPin
    },
    {
      label: "Payment Methods",
      description: "Manage saved payment methods",
      href: `${prefix}/account/payment-methods`,
      icon: CreditCard
    }
  ]

  if (isEnabled('subscriptions')) {
    dashboardLinks.push({
      label: "Subscriptions",
      description: "Manage your subscriptions",
      href: `${prefix}/account/subscriptions`,
      icon: ArrowRightMini,
      feature: 'subscriptions'
    })
  }

  if (isEnabled('reviews')) {
    dashboardLinks.push({
      label: "My Reviews",
      description: "View and manage your reviews",
      href: `${prefix}/account/reviews`,
      icon: Star,
      feature: 'reviews'
    })
  }

  if (isEnabled('bookings')) {
    dashboardLinks.push({
      label: "Bookings",
      description: "View your appointments",
      href: `${prefix}/account/bookings`,
      icon: Calendar,
      feature: 'bookings'
    })
  }

  if (isEnabled('b2b')) {
    dashboardLinks.push({
      label: "Business Portal",
      description: "Access B2B features",
      href: `${prefix}/business`,
      icon: Buildings,
      feature: 'b2b'
    })
  }

  if (isEnabled('quotes')) {
    dashboardLinks.push({
      label: "Quotes",
      description: "View your quote requests",
      href: `${prefix}/account/quotes`,
      icon: DocumentText,
      feature: 'quotes'
    })
  }

  if (isEnabled('invoices')) {
    dashboardLinks.push({
      label: "Invoices",
      description: "View your invoices",
      href: `${prefix}/account/invoices`,
      icon: DocumentText,
      feature: 'invoices'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {customer.first_name || 'there'}!
        </h1>
        <p className="mt-1 text-gray-600">{customer.email}</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-2xl font-bold">{stats.orderCount || 0}</p>
                <p className="text-sm text-gray-600">Orders</p>
              </div>
            </div>
          </div>
          
          {isEnabled('reviews') && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.reviewCount || 0}</p>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardLinks.map((link, index) => {
          const Icon = link.icon
          return (
            <Link
              key={index}
              to={link.href as any}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Icon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-600">
                    {link.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`${prefix}/store` as any}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
          
          {isEnabled('subscriptions') && (
            <Link
              to={`${prefix}/subscriptions` as any}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Start a Subscription
            </Link>
          )}
          
          {isEnabled('bookings') && (
            <Link
              to={`${prefix}/bookings` as any}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              Book a Service
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
