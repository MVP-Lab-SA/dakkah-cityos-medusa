import React, { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { GovernancePolicy, GovernanceAuthority } from "@/lib/types/cityos"
import { useTenant } from "./tenant-context"

interface GovernanceContextValue {
  effectivePolicies: GovernancePolicy | null
  authorities: GovernanceAuthority[]
  isLoading: boolean
  isVerticalAllowed: (vertical: string) => boolean
  isFeatureAllowed: (feature: string) => boolean
  getCommercePolicy: () => GovernancePolicy["commerce"] | undefined
}

const defaultValue: GovernanceContextValue = {
  effectivePolicies: null,
  authorities: [],
  isLoading: false,
  isVerticalAllowed: () => true,
  isFeatureAllowed: () => true,
  getCommercePolicy: () => undefined,
}

const GovernanceContext = createContext<GovernanceContextValue>(defaultValue)

export function useGovernanceContext() {
  if (typeof window === "undefined") {
    return defaultValue
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(GovernanceContext)
}

export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") {
    return (
      <GovernanceContext.Provider value={defaultValue}>
        {children}
      </GovernanceContext.Provider>
    )
  }

  return <ClientGovernanceProvider>{children}</ClientGovernanceProvider>
}

function ClientGovernanceProvider({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant()
  const tenantId = tenant?.id || ""

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.governance.policies(tenantId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        authorities: GovernanceAuthority[]
        effective_policies: GovernancePolicy
      }>(`/store/cityos/governance?tenant_id=${tenantId}`, {
        credentials: "include",
      })
      return response
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })

  const effectivePolicies = data?.effective_policies || null
  const authorities = data?.authorities || []

  const isVerticalAllowed = (vertical: string): boolean => {
    if (!effectivePolicies) return true
    const prohibited = effectivePolicies.content_moderation?.prohibited_categories
    if (prohibited && Array.isArray(prohibited)) {
      return !prohibited.includes(vertical.toLowerCase())
    }
    return true
  }

  const isFeatureAllowed = (feature: string): boolean => {
    if (!effectivePolicies) return true
    const commerce = effectivePolicies.commerce as Record<string, unknown> | undefined
    if (commerce && feature in commerce) {
      return commerce[feature] !== false
    }
    return true
  }

  const getCommercePolicy = () => effectivePolicies?.commerce

  return (
    <GovernanceContext.Provider
      value={{
        effectivePolicies,
        authorities,
        isLoading,
        isVerticalAllowed,
        isFeatureAllowed,
        getCommercePolicy,
      }}
    >
      {children}
    </GovernanceContext.Provider>
  )
}
