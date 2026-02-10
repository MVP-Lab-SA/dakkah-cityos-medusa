import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/utils/query-keys'
import { getUnifiedClient } from '@/lib/api/unified-client'

interface Branding {
  id?: string
  name?: string
  handle?: string
  logo?: {
    url: string
    alt?: string
  }
  favicon?: {
    url: string
  }
  themeConfig?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
  seo?: {
    title?: string
    description?: string
    ogImage?: any
  }
}

interface BrandingContextType {
  branding: Branding | null
  tenantHandle: string | null
  setTenantHandle: (handle: string | null) => void
  isLoading: boolean
}

const BrandingContext = createContext<BrandingContextType>({
  branding: null,
  tenantHandle: null,
  setTenantHandle: () => {},
  isLoading: false,
})

export const useBranding = () => useContext(BrandingContext)

interface BrandingProviderProps {
  children: React.ReactNode
  initialTenantHandle?: string | null
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({
  children,
  initialTenantHandle = null,
}) => {
  if (typeof window === 'undefined') {
    return (
      <BrandingContext.Provider
        value={{
          branding: null,
          tenantHandle: initialTenantHandle,
          setTenantHandle: () => {},
          isLoading: false,
        }}
      >
        {children}
      </BrandingContext.Provider>
    )
  }

  return (
    <ClientBrandingProvider initialTenantHandle={initialTenantHandle}>
      {children}
    </ClientBrandingProvider>
  )
}

const ClientBrandingProvider: React.FC<BrandingProviderProps> = ({
  children,
  initialTenantHandle = null,
}) => {
  const [tenantHandle, setTenantHandle] = useState<string | null>(
    initialTenantHandle || localStorage.getItem('tenant_handle')
  )

  const { data: branding, isLoading } = useQuery({
    queryKey: queryKeys.tenants.byHandle(tenantHandle || 'default'),
    queryFn: async () => {
      if (!tenantHandle) return null

      const client = getUnifiedClient()
      const stores = await client.getStores()
      return stores.find(s => s.handle === tenantHandle) || null
    },
    enabled: !!tenantHandle,
  })

  useEffect(() => {
    if (branding) {
      if (branding.themeConfig?.primaryColor) {
        document.documentElement.style.setProperty(
          '--color-primary',
          branding.themeConfig.primaryColor
        )
      }
      if (branding.themeConfig?.secondaryColor) {
        document.documentElement.style.setProperty(
          '--color-secondary',
          branding.themeConfig.secondaryColor
        )
      }
      if (branding.themeConfig?.fontFamily) {
        document.documentElement.style.setProperty(
          '--font-family',
          branding.themeConfig.fontFamily
        )
      }

      if (branding.name) {
        document.title = branding.name
      }

      if (branding.favicon?.url) {
        const favicon = document.querySelector(
          'link[rel="icon"]'
        ) as HTMLLinkElement
        if (favicon) {
          favicon.href = branding.favicon.url
        }
      }
    }
  }, [branding])

  useEffect(() => {
    if (tenantHandle) {
      localStorage.setItem('tenant_handle', tenantHandle)
    } else {
      localStorage.removeItem('tenant_handle')
    }
  }, [tenantHandle])

  return (
    <BrandingContext.Provider
      value={{
        branding: branding ?? null,
        tenantHandle,
        setTenantHandle,
        isLoading,
      }}
    >
      {children}
    </BrandingContext.Provider>
  )
}
