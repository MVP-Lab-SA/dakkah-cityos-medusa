import { useFeatures } from "../../lib/context/feature-context"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import { HeroSection } from "./sections/hero-section"
import { FeaturedProductsSection } from "./sections/featured-products-section"
import { CategoriesSection } from "./sections/categories-section"
import { VendorsSection } from "./sections/vendors-section"
import { ServicesSection } from "./sections/services-section"
import { SubscriptionsSection } from "./sections/subscriptions-section"
import { ReviewsSection } from "./sections/reviews-section"
import { NewsletterSection } from "./sections/newsletter-section"

interface ModularHomepageProps {
  featuredProducts?: any[]
  categories?: any[]
  vendors?: any[]
  services?: any[]
  reviews?: any[]
}

export function ModularHomepage({
  featuredProducts = [],
  categories = [],
  vendors = [],
  services = [],
  reviews = []
}: ModularHomepageProps) {
  const tenantPrefix = useTenantPrefix()
  const { getHomepageSections, loading } = useFeatures()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const sections = getHomepageSections()

  const renderSection = (section: { id: string; type: string; config: Record<string, any> }) => {
    switch (section.type) {
      case 'hero':
        return (
          <HeroSection
            key={section.id}
            config={section.config}
          />
        )
      
      case 'featured_products':
        return (
          <FeaturedProductsSection
            key={section.id}
            tenantPrefix={tenantPrefix}
            products={featuredProducts.slice(0, section.config.limit || 8)}
            config={section.config}
          />
        )
      
      case 'categories':
        return (
          <CategoriesSection
            key={section.id}
            tenantPrefix={tenantPrefix}
            categories={categories.slice(0, section.config.limit || 6)}
            config={section.config}
          />
        )
      
      case 'vendors':
        return (
          <VendorsSection
            key={section.id}
            vendors={vendors.slice(0, section.config.limit || 4)}
            config={section.config}
          />
        )
      
      case 'services':
        return (
          <ServicesSection
            key={section.id}
            services={services.slice(0, section.config.limit || 4)}
            config={section.config}
          />
        )
      
      case 'subscriptions':
        return (
          <SubscriptionsSection
            key={section.id}
            config={section.config}
          />
        )
      
      case 'reviews':
        return (
          <ReviewsSection
            key={section.id}
            reviews={reviews.slice(0, section.config.limit || 3)}
            config={section.config}
          />
        )
      
      case 'newsletter':
        return (
          <NewsletterSection
            key={section.id}
            config={section.config}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col">
      {sections.map(section => renderSection(section))}
    </div>
  )
}
