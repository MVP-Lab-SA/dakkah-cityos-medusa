import { Link } from "@tanstack/react-router"
import { useFeatures } from "../../lib/context/feature-context"

interface DynamicFooterProps {
  countryCode: string
  categories?: Array<{ id: string; name: string; handle: string }>
}

export function DynamicFooter({ countryCode, categories = [] }: DynamicFooterProps) {
  const { getNavigation, isEnabled } = useFeatures()
  const navigation = getNavigation()
  const { footer } = navigation

  // Build footer sections based on feature flags
  const sections: Array<{ title: string; links: Array<{ label: string; href: string }> }> = []

  // Shop section (categories)
  if (footer.showCategories && categories.length > 0) {
    sections.push({
      title: "Shop",
      links: categories.slice(0, 6).map(cat => ({
        label: cat.name,
        href: `/${countryCode}/categories/${cat.handle}`
      }))
    })
  }

  // Vendors section
  if (footer.showVendors && isEnabled('marketplace')) {
    sections.push({
      title: "Marketplace",
      links: [
        { label: "Browse Vendors", href: `/${countryCode}/vendors` },
        { label: "Become a Vendor", href: `/${countryCode}/vendor/register` }
      ]
    })
  }

  // Services section
  if (footer.showServices && isEnabled('bookings')) {
    sections.push({
      title: "Services",
      links: [
        { label: "Browse Services", href: `/${countryCode}/services` },
        { label: "Book Appointment", href: `/${countryCode}/bookings` }
      ]
    })
  }

  // Customer section
  const customerLinks = [
    { label: "My Account", href: `/${countryCode}/account` },
    { label: "Order History", href: `/${countryCode}/account/orders` }
  ]

  if (isEnabled('wishlists')) {
    customerLinks.push({ label: "Wishlist", href: `/${countryCode}/account/wishlist` })
  }

  if (isEnabled('subscriptions')) {
    customerLinks.push({ label: "Subscriptions", href: `/${countryCode}/account/subscriptions` })
  }

  if (isEnabled('b2b')) {
    customerLinks.push({ label: "Business Portal", href: `/${countryCode}/business` })
  }

  sections.push({
    title: "Account",
    links: customerLinks
  })

  // Help section
  sections.push({
    title: "Help",
    links: [
      { label: "Contact Us", href: `/${countryCode}/contact` },
      { label: "Shipping Info", href: `/${countryCode}/shipping` },
      { label: "Returns", href: `/${countryCode}/returns` },
      { label: "FAQ", href: `/${countryCode}/faq` }
    ]
  })

  // Custom sections from config
  footer.customSections?.forEach(section => {
    sections.push({
      title: section.title,
      links: section.links.map(link => ({
        label: link.label,
        href: link.href.startsWith('/') ? `/${countryCode}${link.href}` : link.href
      }))
    })
  })

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to={`/${countryCode}`} className="text-xl font-bold">
              Store
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Your one-stop shop for quality products and services.
            </p>
          </div>

          {/* Dynamic sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {new Date().getFullYear()} Store. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to={`/${countryCode}/privacy`} className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to={`/${countryCode}/terms`} className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
