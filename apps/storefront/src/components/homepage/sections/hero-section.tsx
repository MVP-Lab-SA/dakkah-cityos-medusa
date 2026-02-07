import { Link } from "@tanstack/react-router"

interface HeroSectionProps {
  countryCode: string
  config: Record<string, any>
}

export function HeroSection({ countryCode, config }: HeroSectionProps) {
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {config.title || "Welcome to Our Store"}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300">
            {config.subtitle || "Discover amazing products at great prices. Quality guaranteed."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to={`/${countryCode}/products`}
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to={`/${countryCode}/categories`}
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
