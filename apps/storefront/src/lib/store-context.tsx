import { createContext, useContext, type ReactNode } from 'react'

export interface StoreConfig {
  id: string
  handle: string
  name: string
  subdomain: string | null
  customDomain: string | null
  tenantId: string
  salesChannelId: string
  isActive: boolean
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    logo: string | null
    favicon: string | null
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

interface StoreContextValue {
  store: StoreConfig | null
  isLoading: boolean
  error: Error | null
}

const StoreContext = createContext<StoreContextValue>({
  store: null,
  isLoading: false,
  error: null,
})

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}

interface StoreProviderProps {
  children: ReactNode
  initialStore: StoreConfig | null
}

export function StoreProvider({ children, initialStore }: StoreProviderProps) {
  return (
    <StoreContext.Provider
      value={{
        store: initialStore,
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
