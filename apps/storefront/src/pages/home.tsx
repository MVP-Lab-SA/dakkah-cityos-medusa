import { Link, useLocation } from "@tanstack/react-router"

function getBasePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length >= 2) {
    return `/${segments[0]}/${segments[1]}`
  }
  if (segments.length === 1) {
    return `/${segments[0]}`
  }
  return ""
}

const sections = [
  {
    title: "Shop",
    links: [
      { name: "Store", path: "/store" },
      { name: "Stores (Multi-Vendor)", path: "/stores" },
      { name: "Search", path: "/search" },
      { name: "Cart", path: "/cart" },
      { name: "Checkout", path: "/checkout" },
    ],
  },
  {
    title: "Products & Categories",
    links: [
      { name: "Categories: Accessories", path: "/categories/accessories" },
      { name: "Categories: Electronics", path: "/categories/electronics" },
      { name: "Categories: Fashion", path: "/categories/fashion" },
    ],
  },
  {
    title: "Auth",
    links: [
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
      { name: "Reset Password", path: "/reset-password" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Account Dashboard", path: "/account" },
      { name: "Profile", path: "/account/profile" },
      { name: "Addresses", path: "/account/addresses" },
      { name: "Settings", path: "/account/settings" },
      { name: "Orders", path: "/account/orders" },
      { name: "Subscriptions", path: "/account/subscriptions" },
      { name: "Purchase Orders", path: "/account/purchase-orders" },
      { name: "New Purchase Order", path: "/account/purchase-orders/new" },
      { name: "My Bookings", path: "/account/bookings" },
    ],
  },
  {
    title: "Subscriptions",
    links: [
      { name: "Browse Subscriptions", path: "/subscriptions" },
      { name: "Subscription Checkout", path: "/subscriptions/checkout" },
      { name: "Subscription Success", path: "/subscriptions/success" },
    ],
  },
  {
    title: "Bookings",
    links: [
      { name: "Browse Bookings", path: "/bookings" },
      { name: "Booking Confirmation", path: "/bookings/confirmation" },
    ],
  },
  {
    title: "Vendors (Marketplace)",
    links: [
      { name: "All Vendors", path: "/vendors" },
    ],
  },
  {
    title: "Vendor Dashboard (Seller Panel)",
    links: [
      { name: "Vendor Dashboard", path: "/vendor" },
      { name: "Vendor Register", path: "/vendor/register" },
      { name: "Vendor Products", path: "/vendor/products" },
      { name: "Add Product", path: "/vendor/products/new" },
      { name: "Vendor Orders", path: "/vendor/orders" },
      { name: "Vendor Payouts", path: "/vendor/payouts" },
      { name: "Vendor Commissions", path: "/vendor/commissions" },
    ],
  },
  {
    title: "B2B",
    links: [
      { name: "B2B Register", path: "/b2b/register" },
      { name: "B2B Dashboard", path: "/b2b/dashboard" },
    ],
  },
  {
    title: "Business (Company Purchasing)",
    links: [
      { name: "Business Orders", path: "/business/orders" },
      { name: "Business Approvals", path: "/business/approvals" },
      { name: "Business Team", path: "/business/team" },
    ],
  },
  {
    title: "Quotes (B2B Quoting)",
    links: [
      { name: "Quotes List", path: "/quotes" },
      { name: "Request a Quote", path: "/quotes/request" },
    ],
  },
]

const Home = () => {
  const location = useLocation()
  const prefix = getBasePrefix(location.pathname)

  return (
    <div className="content-container py-12">
      <h1 className="text-3xl font-bold mb-2">Dakkah CityOS Commerce</h1>
      <p className="text-zinc-500 mb-8">
        All pages directory — click any link to navigate.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="border border-zinc-200 rounded-lg p-5"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.path}>
                  <a
                    href={`${prefix}${link.path}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
