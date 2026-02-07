import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { sdk } from "../sdk"

/**
 * Feature Flags Context
 * 
 * Provides feature configuration throughout the storefront.
 * Features are loaded once on app initialization and cached.
 */

export interface FeatureFlags {
  // Module enablement
  marketplace: boolean
  b2b: boolean
  subscriptions: boolean
  bookings: boolean
  reviews: boolean
  volumePricing: boolean
  wishlists: boolean
  giftCards: boolean
  quotes: boolean
  invoices: boolean
  
  // Module-specific config
  config: {
    marketplace?: {
      allowRegistration: boolean
      showVendorPages: boolean
    }
    b2b?: {
      allowRegistration: boolean
      enableQuotes: boolean
    }
    subscriptions?: {
      showOnProducts: boolean
      trialEnabled: boolean
      trialDays: number
    }
    bookings?: {
      showOnHomepage: boolean
    }
    reviews?: {
      showOnProducts: boolean
      allowPhotos: boolean
    }
    volumePricing?: {
      showOnProducts: boolean
      showSavings: boolean
    }
  }
  
  // Homepage configuration
  homepage: {
    sections: Array<{
      id: string
      type: string
      enabled: boolean
      config: Record<string, any>
    }>
  }
  
  // Navigation configuration
  navigation: {
    header: {
      showCategories: boolean
      showVendors: boolean
      showServices: boolean
      showB2BPortal: boolean
      customLinks: Array<{ label: string; href: string }>
    }
    footer: {
      showCategories: boolean
      showVendors: boolean
      showServices: boolean
      customSections: Array<{ title: string; links: Array<{ label: string; href: string }> }>
    }
  }
}

interface FeatureContextValue {
  features: FeatureFlags | null
  loading: boolean
  error: Error | null
  
  // Helper functions
  isEnabled: (feature: keyof Omit<FeatureFlags, 'config' | 'homepage' | 'navigation'>) => boolean
  getConfig: <T extends keyof FeatureFlags['config']>(module: T) => FeatureFlags['config'][T] | undefined
  getHomepageSections: () => FeatureFlags['homepage']['sections']
  getNavigation: () => FeatureFlags['navigation']
}

const defaultFeatures: FeatureFlags = {
  marketplace: false,
  b2b: false,
  subscriptions: false,
  bookings: false,
  reviews: true,
  volumePricing: false,
  wishlists: true,
  giftCards: false,
  quotes: false,
  invoices: false,
  config: {},
  homepage: {
    sections: [
      { id: 'hero', type: 'hero', enabled: true, config: {} },
      { id: 'featured', type: 'featured_products', enabled: true, config: { limit: 8 } },
      { id: 'categories', type: 'categories', enabled: true, config: { limit: 6 } },
      { id: 'newsletter', type: 'newsletter', enabled: true, config: {} }
    ]
  },
  navigation: {
    header: {
      showCategories: true,
      showVendors: false,
      showServices: false,
      showB2BPortal: false,
      customLinks: []
    },
    footer: {
      showCategories: true,
      showVendors: false,
      showServices: false,
      customSections: []
    }
  }
}

const FeatureContext = createContext<FeatureContextValue>({
  features: defaultFeatures,
  loading: false,
  error: null,
  isEnabled: () => false,
  getConfig: () => undefined,
  getHomepageSections: () => [],
  getNavigation: () => defaultFeatures.navigation
})

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<FeatureFlags | null>(defaultFeatures)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadFeatures() {
      try {
        const response = await sdk.client.fetch<{ features: FeatureFlags }>("/store/features", {
          method: "GET",
          headers: {}
        })
        setFeatures(response.features)
      } catch (err) {
        console.error("Failed to load features:", err)
        setError(err as Error)
        // Keep default features on error
      } finally {
        setLoading(false)
      }
    }

    loadFeatures()
  }, [])

  const isEnabled = (feature: keyof Omit<FeatureFlags, 'config' | 'homepage' | 'navigation'>): boolean => {
    return features?.[feature] ?? false
  }

  const getConfig = <T extends keyof FeatureFlags['config']>(module: T): FeatureFlags['config'][T] | undefined => {
    return features?.config?.[module]
  }

  const getHomepageSections = () => {
    return features?.homepage?.sections?.filter(s => s.enabled) ?? []
  }

  const getNavigation = () => {
    return features?.navigation ?? defaultFeatures.navigation
  }

  return (
    <FeatureContext.Provider
      value={{
        features,
        loading,
        error,
        isEnabled,
        getConfig,
        getHomepageSections,
        getNavigation
      }}
    >
      {children}
    </FeatureContext.Provider>
  )
}

export function useFeatures() {
  const context = useContext(FeatureContext)
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureProvider")
  }
  return context
}

// Convenience hooks for specific features
export function useMarketplace() {
  const { isEnabled, getConfig } = useFeatures()
  return {
    enabled: isEnabled('marketplace'),
    config: getConfig('marketplace')
  }
}

export function useB2B() {
  const { isEnabled, getConfig, features } = useFeatures()
  return {
    enabled: isEnabled('b2b'),
    config: getConfig('b2b'),
    quotesEnabled: features?.quotes ?? false,
    invoicesEnabled: features?.invoices ?? false
  }
}

export function useSubscriptions() {
  const { isEnabled, getConfig } = useFeatures()
  return {
    enabled: isEnabled('subscriptions'),
    config: getConfig('subscriptions')
  }
}

export function useBookings() {
  const { isEnabled, getConfig } = useFeatures()
  return {
    enabled: isEnabled('bookings'),
    config: getConfig('bookings')
  }
}

export function useReviews() {
  const { isEnabled, getConfig } = useFeatures()
  return {
    enabled: isEnabled('reviews'),
    config: getConfig('reviews')
  }
}

export function useVolumePricing() {
  const { isEnabled, getConfig } = useFeatures()
  return {
    enabled: isEnabled('volumePricing'),
    config: getConfig('volumePricing')
  }
}
