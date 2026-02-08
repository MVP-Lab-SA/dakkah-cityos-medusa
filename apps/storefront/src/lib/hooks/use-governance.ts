import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { GovernanceAuthority, GovernancePolicy } from "@/lib/types/cityos"

export function useGovernance(tenantId: string) {
  return useQuery({
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
  })
}

export function useEffectivePolicies(tenantId: string) {
  const { data, ...rest } = useGovernance(tenantId)
  return { data: data?.effective_policies, ...rest }
}
