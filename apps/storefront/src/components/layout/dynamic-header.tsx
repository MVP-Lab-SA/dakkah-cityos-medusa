import { Link } from "@tanstack/react-router"
import { useFeatures } from "../../lib/context/feature-context"
import { ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"

interface DynamicHeaderProps {
  countryCode: string
  categories?: Array<{ id: string; name: string; handle: string }>
  cartItemCount?: number
  isLoggedIn?: boolean
}

export function DynamicHeader({ 
  countryCode, 
  categories = [], 
  cartItemCount = 0,
  isLoggedIn = false 
}: DynamicHeaderProps) {
  const { getNavigation, isEnabled } = useFeatures()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const navigation = getNavigation()
  const { header } = navigation

  // Build navigation items based on feature flags
  const navItems: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }> = []

  // Categories dropdown
  if (header.showCategories && categories.length > 0) {
    navItems.push({
      label: "Shop",
      href: `/${countryCode}/categories`,
      children: categories.map(cat => ({
        label: cat.name,
        href: `/${countryCode}/categories/${cat.handle}`
      }))
    })
  }

  // Vendors (if marketplace enabled)
  if (header.showVendors && isEnabled('marketplace')) {
    navItems.push({
      label: "Vendors",
      href: `/${countryCode}/vendors`
    })
  }

  // Services (if bookings enabled)
  if (header.showServices && isEnabled('bookings')) {
    navItems.push({
      label: "Services",
      href: `/${countryCode}/services`
    })
  }

  // B2B Portal
  if (header.showB2BPortal && isEnabled('b2b')) {
    navItems.push({
      label: "Business",
      href: `/${countryCode}/business`
    })
  }

  // Custom links
  header.customLinks?.forEach(link => {
    navItems.push({
      label: link.label,
      href: link.href.startsWith('/') ? `/${countryCode}${link.href}` : link.href
    })
  })

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/${countryCode}`} className="flex-shrink-0">
            <span className="text-xl font-bold">Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div 
                key={index}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium"
                >
                  {item.label}
                  {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>
                
                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            <Link
              to={isLoggedIn ? `/${countryCode}/account` : `/${countryCode}/login`}
              className="text-gray-700 hover:text-gray-900"
            >
              <User className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link
              to={`/${countryCode}/cart`}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item, index) => (
              <div key={index}>
                <Link
                  to={item.href}
                  className="block py-2 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => !item.children && setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.href}
                        className="block py-1 text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
