import { CartDropdown } from "@/components/cart"
import { UserMenu } from "@/components/auth"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCategories } from "@/lib/hooks/use-categories"
import { useAuth } from "@/lib/context/auth-context"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Link, useLocation } from "@tanstack/react-router"
import { useState } from "react"

const SERVICE_GROUPS = [
  {
    label: "Health & Wellness",
    items: [
      { name: "Healthcare", href: "/healthcare" },
      { name: "Fitness", href: "/fitness" },
      { name: "Pet Services", href: "/pet-services" },
    ],
  },
  {
    label: "Education & Legal",
    items: [
      { name: "Education", href: "/education" },
      { name: "Legal", href: "/legal" },
      { name: "Government", href: "/government" },
    ],
  },
  {
    label: "Food & Dining",
    items: [
      { name: "Restaurants", href: "/restaurants" },
      { name: "Grocery", href: "/grocery" },
    ],
  },
  {
    label: "Property",
    items: [
      { name: "Real Estate", href: "/real-estate" },
      { name: "Parking", href: "/parking" },
    ],
  },
  {
    label: "Transportation",
    items: [
      { name: "Automotive", href: "/automotive" },
      { name: "Travel", href: "/travel" },
    ],
  },
  {
    label: "Entertainment",
    items: [
      { name: "Events", href: "/events" },
      { name: "Auctions", href: "/auctions" },
      { name: "Social Commerce", href: "/social-commerce" },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Financial Products", href: "/financial-products" },
      { name: "Memberships", href: "/memberships" },
      { name: "Crowdfunding", href: "/crowdfunding" },
    ],
  },
  {
    label: "Professional",
    items: [
      { name: "Freelance", href: "/freelance" },
      { name: "Digital Products", href: "/digital-products" },
      { name: "Advertising", href: "/advertising" },
    ],
  },
  {
    label: "Community",
    items: [
      { name: "Charity", href: "/charity" },
      { name: "Classifieds", href: "/classifieds" },
      { name: "Utilities", href: "/utilities" },
    ],
  },
  {
    label: "Protection",
    items: [
      { name: "Warranties", href: "/warranties" },
      { name: "Rentals", href: "/rentals" },
    ],
  },
] as const

export const Navbar = () => {
  if (typeof window === "undefined") {
    return (
      <div className="sticky top-0 inset-x-0 z-40">
        <header className="relative h-16 mx-auto border-b bg-white border-zinc-200">
          <nav className="content-container text-sm font-medium text-zinc-600 flex items-center justify-between w-full h-full">
            <div className="flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
              <span className="text-xl font-bold uppercase">Dakkah CityOS</span>
            </div>
          </nav>
        </header>
      </div>
    )
  }

  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({})

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id",
    queryParams: { parent_category_id: "null" },
  })

  const categoryLinks = [
    { id: "shop-all", name: "Shop all", to: `${baseHref}/store` },
    ...(topLevelCategories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      to: `${baseHref}/categories/${cat.handle}`,
    })) ?? []),
  ]

  const toggleMobileSection = (key: string) => {
    setOpenMobileSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="sticky top-0 inset-x-0 z-40">
      <header className="relative h-16 mx-auto border-b bg-white border-zinc-200">
        <nav className="content-container text-sm font-medium text-zinc-600 flex items-center justify-between w-full h-full">
          {/* Desktop Navigation */}
          <NavigationMenu.Root className="hidden lg:flex items-center h-full">
            <NavigationMenu.List className="flex items-center gap-x-6 h-full">
              {/* Shop dropdown */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Trigger className="text-zinc-600 hover:text-zinc-500 h-full flex items-center gap-1 select-none">
                  Shop
                  <svg className="w-3 h-3 ml-0.5 transition-transform duration-200 group-data-[state=open]:rotate-180" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="content-container py-8">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-zinc-900 text-base font-semibold uppercase tracking-wide">
                      Categories
                    </h3>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                      {categoryLinks.map((link) => (
                        <NavigationMenu.Link key={link.id} asChild>
                          <Link
                            to={link.to}
                            className="text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-colors py-1"
                          >
                            {link.name}
                          </Link>
                        </NavigationMenu.Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* Services Mega-Menu */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Trigger className="text-zinc-600 hover:text-zinc-500 h-full flex items-center gap-1 select-none">
                  Services
                  <svg className="w-3 h-3 ml-0.5 transition-transform duration-200 group-data-[state=open]:rotate-180" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="content-container py-8">
                  <div className="grid grid-cols-5 gap-x-8 gap-y-6">
                    {SERVICE_GROUPS.map((group) => (
                      <div key={group.label} className="flex flex-col gap-2">
                        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                          {group.label}
                        </h4>
                        <div className="flex flex-col gap-1">
                          {group.items.map((item) => (
                            <NavigationMenu.Link key={item.href} asChild>
                              <Link
                                to={`${baseHref}${item.href}` as any}
                                className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors py-1"
                              >
                                {item.name}
                              </Link>
                            </NavigationMenu.Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* Store Link */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Link asChild>
                  <Link
                    to={`${baseHref}/store` as any}
                    className="text-zinc-600 hover:text-zinc-500 h-full flex items-center"
                  >
                    Store
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>

              {/* Vendors Link */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Link asChild>
                  <Link
                    to={`${baseHref}/vendors` as any}
                    className="text-zinc-600 hover:text-zinc-500 h-full flex items-center"
                  >
                    Vendors
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>

              {/* Bookings Link */}
              <NavigationMenu.Item className="h-full flex items-center">
                <NavigationMenu.Link asChild>
                  <Link
                    to={`${baseHref}/bookings` as any}
                    className="text-zinc-600 hover:text-zinc-500 h-full flex items-center"
                  >
                    Bookings
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Viewport
              className="absolute top-full bg-white border-b border-zinc-200 shadow-lg overflow-hidden
                data-[state=open]:animate-[dropdown-open_300ms_ease-out]
                data-[state=closed]:animate-[dropdown-close_300ms_ease-out]"
              style={{ left: "50%", transform: "translateX(-50%)", width: "100vw" }}
            />
          </NavigationMenu.Root>

          {/* Mobile Menu */}
          <Drawer>
            <DrawerTrigger className="lg:hidden text-zinc-600 hover:text-zinc-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </DrawerTrigger>
            <DrawerContent side="left">
              <DrawerHeader>
                <DrawerTitle className="uppercase">Menu</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col py-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                {/* Shop Section */}
                <button
                  onClick={() => toggleMobileSection("shop")}
                  className="px-6 py-4 text-zinc-900 text-lg font-medium flex items-center justify-between w-full text-left"
                >
                  Shop
                  <svg className={`w-4 h-4 transition-transform duration-200 ${openMobileSections["shop"] ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {openMobileSections["shop"] && (
                  <div className="flex flex-col">
                    {categoryLinks.map((link) => (
                      <DrawerClose key={link.id} asChild>
                        <Link
                          to={link.to}
                          className="px-10 py-3 text-zinc-600 hover:bg-zinc-50 transition-colors"
                        >
                          {link.name}
                        </Link>
                      </DrawerClose>
                    ))}
                  </div>
                )}

                {/* Services Section */}
                <button
                  onClick={() => toggleMobileSection("services")}
                  className="px-6 py-4 text-zinc-900 text-lg font-medium flex items-center justify-between w-full text-left"
                >
                  Services
                  <svg className={`w-4 h-4 transition-transform duration-200 ${openMobileSections["services"] ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {openMobileSections["services"] && (
                  <div className="flex flex-col">
                    {SERVICE_GROUPS.map((group) => (
                      <div key={group.label}>
                        <button
                          onClick={() => toggleMobileSection(`svc-${group.label}`)}
                          className="px-10 py-3 text-zinc-800 text-sm font-semibold uppercase tracking-wider flex items-center justify-between w-full text-left"
                        >
                          {group.label}
                          <svg className={`w-3 h-3 transition-transform duration-200 ${openMobileSections[`svc-${group.label}`] ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {openMobileSections[`svc-${group.label}`] && (
                          <div className="flex flex-col">
                            {group.items.map((item) => (
                              <DrawerClose key={item.href} asChild>
                                <Link
                                  to={`${baseHref}${item.href}` as any}
                                  className="px-14 py-2.5 text-zinc-600 hover:bg-zinc-50 transition-colors text-sm"
                                >
                                  {item.name}
                                </Link>
                              </DrawerClose>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct Links */}
                <div className="border-t border-zinc-100 mt-2 pt-2">
                  <DrawerClose asChild>
                    <Link
                      to={`${baseHref}/store` as any}
                      className="px-6 py-4 text-zinc-900 text-lg font-medium block hover:bg-zinc-50 transition-colors"
                    >
                      Store
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      to={`${baseHref}/vendors` as any}
                      className="px-6 py-4 text-zinc-900 text-lg font-medium block hover:bg-zinc-50 transition-colors"
                    >
                      Vendors
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      to={`${baseHref}/bookings` as any}
                      className="px-6 py-4 text-zinc-900 text-lg font-medium block hover:bg-zinc-50 transition-colors"
                    >
                      Bookings
                    </Link>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Logo */}
          <div className="flex items-center h-full absolute left-1/2 transform -translate-x-1/2">
            <Link
              to={baseHref || "/"}
              className="text-xl font-bold hover:text-zinc-600 uppercase"
            >
              Dakkah CityOS
            </Link>
          </div>

          {/* Cart & User */}
          <div className="flex items-center gap-x-4 h-full justify-end">
            <UserMenu />
            <CartDropdown />
          </div>
        </nav>
      </header>
    </div>
  )
}
