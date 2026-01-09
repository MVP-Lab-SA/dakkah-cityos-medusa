import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/utils/query-keys'
import { unifiedClient } from '@/lib/api/unified-client'

interface Branding {
  logo?: {
    url: string
    alt?: string
  }
  favicon?: {
    url: string
  }
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
  storeName?: string
  storeDescription?: string
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
  const [tenantHandle, setTenantHandle] = useState<string | null>(
    initialTenantHandle || localStorage.getItem('tenant_handle')
  )

  // Fetch branding data when tenant is set
  const { data: branding, isLoading } = useQuery({
    queryKey: queryKeys.tenants.byHandle(tenantHandle || 'default'),
    queryFn: async () => {
      if (!tenantHandle) return null

      const store = await unifiedClient.payload.getStores({
        where: {
          handle: {
            equals: tenantHandle,
          },
        },
        limit: 1,
      })

      return store?.docs?.[0] || null
    },
    enabled: !!tenantHandle,
  })

  // Apply branding to document
  useEffect(() => {
    if (branding) {
      // Apply theme colors as CSS variables
      if (branding.theme?.primaryColor) {
        document.documentElement.style.setProperty(
          '--color-primary',
          branding.theme.primaryColor
        )
      }
      if (branding.theme?.secondaryColor) {
        document.documentElement.style.setProperty(
          '--color-secondary',
          branding.theme.secondaryColor
        )
      }
      if (branding.theme?.fontFamily) {
        document.documentElement.style.setProperty(
          '--font-family',
          branding.theme.fontFamily
        )
      }

      // Update page title
      if (branding.storeName) {
        document.title = branding.storeName
      }

      // Update favicon
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

  // Persist tenant selection
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
        branding,
        tenantHandle,
        setTenantHandle,
        isLoading,
      }}
    >
      {children}
    </BrandingContext.Provider>
  )
}
