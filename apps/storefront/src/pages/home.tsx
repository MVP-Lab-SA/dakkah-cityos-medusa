import { useLocation, useLoaderData } from "@tanstack/react-router"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import ProductCard from "@/components/product-card"

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

const verticalCategories = [
  {
    group: "Shopping",
    verticals: [
      { icon: "🏪", title: "Store", description: "Browse and buy products from our marketplace", path: "/store" },
      { icon: "👥", title: "Vendors", description: "Discover trusted sellers and their collections", path: "/vendors" },
      { icon: "🔨", title: "Auctions", description: "Bid on unique items and score great deals", path: "/auctions" },
      { icon: "🔄", title: "Rentals", description: "Rent equipment, vehicles, and more", path: "/rentals" },
      { icon: "📋", title: "Classifieds", description: "Post and browse local listings", path: "/classifieds" },
      { icon: "💾", title: "Digital Products", description: "Download software, ebooks, and digital goods", path: "/digital-products" },
    ],
  },
  {
    group: "Food & Dining",
    verticals: [
      { icon: "🍽️", title: "Restaurants", description: "Order food from local restaurants", path: "/restaurants" },
      { icon: "🛒", title: "Grocery", description: "Shop groceries for delivery or pickup", path: "/grocery" },
    ],
  },
  {
    group: "Health & Wellness",
    verticals: [
      { icon: "🏥", title: "Healthcare", description: "Book appointments and access health services", path: "/healthcare" },
      { icon: "💪", title: "Fitness", description: "Find gyms, trainers, and wellness programs", path: "/fitness" },
      { icon: "🐾", title: "Pet Services", description: "Care, grooming, and supplies for your pets", path: "/pet-services" },
    ],
  },
  {
    group: "Property & Transport",
    verticals: [
      { icon: "🏠", title: "Real Estate", description: "Buy, sell, or rent properties", path: "/real-estate" },
      { icon: "🅿️", title: "Parking", description: "Find and reserve parking spaces", path: "/parking" },
      { icon: "🚗", title: "Automotive", description: "Vehicles, parts, and auto services", path: "/automotive" },
      { icon: "✈️", title: "Travel", description: "Plan trips, book flights, and accommodations", path: "/travel" },
    ],
  },
  {
    group: "Education & Professional",
    verticals: [
      { icon: "🎓", title: "Education", description: "Courses, tutoring, and learning resources", path: "/education" },
      { icon: "⚖️", title: "Legal", description: "Legal services and consultation", path: "/legal" },
      { icon: "💼", title: "Freelance", description: "Hire freelancers or offer your skills", path: "/freelance" },
    ],
  },
  {
    group: "Finance & Community",
    verticals: [
      { icon: "💰", title: "Financial Products", description: "Insurance, loans, and financial tools", path: "/financial-products" },
      { icon: "🎫", title: "Memberships", description: "Join clubs, communities, and membership programs", path: "/memberships" },
      { icon: "🚀", title: "Crowdfunding", description: "Back projects and launch campaigns", path: "/crowdfunding" },
      { icon: "❤️", title: "Charity", description: "Donate to causes and support nonprofits", path: "/charity" },
    ],
  },
  {
    group: "Entertainment",
    verticals: [
      { icon: "🎪", title: "Events", description: "Discover and book tickets for events", path: "/events" },
      { icon: "📱", title: "Social Commerce", description: "Shop through social experiences", path: "/social-commerce" },
      { icon: "📢", title: "Advertising", description: "Promote your business and reach audiences", path: "/advertising" },
    ],
  },
  {
    group: "Services",
    verticals: [
      { icon: "📅", title: "Bookings", description: "Schedule appointments and services", path: "/bookings" },
      { icon: "🏛️", title: "Government", description: "Access government services and permits", path: "/government" },
      { icon: "⚡", title: "Utilities", description: "Manage utility services and payments", path: "/utilities" },
      { icon: "🛡️", title: "Warranties", description: "Extended warranties and protection plans", path: "/warranties" },
    ],
  },
]

const steps = [
  { number: "01", title: "Browse", description: "Explore 25+ verticals and find exactly what you need across shopping, services, dining, and more." },
  { number: "02", title: "Order", description: "Add to cart, book a service, or place a bid — our unified checkout handles it all seamlessly." },
  { number: "03", title: "Enjoy", description: "Get deliveries, attend events, or access services. Track everything from your dashboard." },
]

const stats = [
  { value: "25+", label: "Verticals" },
  { value: "190+", label: "Data Models" },
  { value: "500+", label: "Workflows" },
]

const Home = () => {
  const location = useLocation()
  const prefix = getBasePrefix(location.pathname)
  const loaderData = useLoaderData({ strict: false }) as any
  const region = loaderData?.region

  const { data } = useProducts({
    region_id: region?.id,
    query_params: { limit: 4, order: "-created_at" },
  })

  const { data: categories } = useCategories({
    queryParams: { limit: 6 },
    enabled: true,
  })

  const products = data?.pages?.flatMap((page: any) => page.products) || []

  return (
    <div>
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
        <div className="content-container py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Dakkah CityOS Commerce Platform
            </h1>
            <p className="mt-6 text-lg md:text-xl text-zinc-300 leading-relaxed">
              Your gateway to 25+ commerce verticals — from shopping and dining to healthcare, education, real estate, and beyond
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={`${prefix}/store`}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors text-base"
              >
                Explore Store
              </a>
              <a
                href={`${prefix}/bookings`}
                className="inline-flex items-center justify-center px-8 py-3.5 border border-zinc-500 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-base"
              >
                Browse Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-16 bg-white">
          <div className="content-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Featured Products</h2>
              <a
                href={`${prefix}/store`}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                View All →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-zinc-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Discover All Verticals</h2>
            <p className="mt-3 text-zinc-500 max-w-2xl mx-auto">
              One platform, every commerce vertical. Explore the full ecosystem of services and marketplaces.
            </p>
          </div>

          <div className="space-y-12">
            {verticalCategories.map((category) => (
              <div key={category.group}>
                <h3 className="text-lg font-semibold text-zinc-700 mb-4 border-b border-zinc-200 pb-2">
                  {category.group}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.verticals.map((vertical) => (
                    <a
                      key={vertical.path}
                      href={`${prefix}${vertical.path}`}
                      className="group flex items-start gap-3 p-4 bg-white rounded-lg border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all"
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">{vertical.icon}</span>
                      <div className="min-w-0">
                        <h4 className="font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors">
                          {vertical.title}
                        </h4>
                        <p className="text-sm text-zinc-500 mt-0.5 leading-snug">
                          {vertical.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="content-container">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Shop by Category</h2>
              <p className="mt-3 text-zinc-500">Find products organized by what you're looking for</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat: any) => (
                <a
                  key={cat.id}
                  href={`${prefix}/categories/${cat.handle}`}
                  className="group flex flex-col items-center p-6 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors text-center"
                >
                  <span className="text-3xl mb-3">🏷️</span>
                  <span className="font-medium text-zinc-900 group-hover:text-zinc-700 text-sm">
                    {cat.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-zinc-900 text-white">
        <div className="content-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-zinc-400">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 text-lg font-bold text-white mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-zinc-900">{stat.value}</div>
                <div className="mt-2 text-zinc-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
