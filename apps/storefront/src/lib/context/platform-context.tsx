import React, { createContext, useContext, useState, useEffect } from "react"
import { usePlatformContext } from "@/lib/hooks/use-platform-context"
import type { PlatformContextData, PlatformCapabilities, PlatformGovernanceChain, PlatformNodeHierarchy } from "@/lib/types/cityos"

interface PlatformContextValue {
  data: PlatformContextData | null
  isLoading: boolean
  isError: boolean
  nodeHierarchy: PlatformNodeHierarchy[]
  governanceChain: PlatformGovernanceChain | null
  capabilities: PlatformCapabilities | null
  systems: PlatformContextData["systems"] | null
  contextHeaders: string[]
  hierarchyLevels: string[]
  isDefaultTenant: boolean
}

const defaultValue: PlatformContextValue = {
  data: null,
  isLoading: false,
  isError: false,
  nodeHierarchy: [],
  governanceChain: null,
  capabilities: null,
  systems: null,
  contextHeaders: [],
  hierarchyLevels: [],
  isDefaultTenant: false,
}

const PlatformContext = createContext<PlatformContextValue>(defaultValue)

export function usePlatformContextValue() {
  return useContext(PlatformContext)
}

export function PlatformContextProvider({
  children,
  tenantSlug,
}: {
  children: React.ReactNode
  tenantSlug: string
}) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  if (!isClient) {
    return (
      <PlatformContext.Provider value={defaultValue}>
        {children}
      </PlatformContext.Provider>
    )
  }

  return <ClientPlatformProvider tenantSlug={tenantSlug}>{children}</ClientPlatformProvider>
}

function ClientPlatformProvider({
  children,
  tenantSlug,
}: {
  children: React.ReactNode
  tenantSlug: string
}) {
  const { data, isLoading, isError } = usePlatformContext(tenantSlug)

  const value: PlatformContextValue = {
    data: data || null,
    isLoading,
    isError,
    nodeHierarchy: data?.nodeHierarchy || [],
    governanceChain: data?.governanceChain || null,
    capabilities: data?.capabilities || null,
    systems: data?.systems || null,
    contextHeaders: data?.contextHeaders || [],
    hierarchyLevels: data?.hierarchyLevels || [],
    isDefaultTenant: data?.isDefaultTenant || false,
  }

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  )
}
