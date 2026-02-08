import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { Persona } from "@/lib/types/cityos"

export function usePersonas(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.personas.list(tenantId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        personas: Persona[]
        resolved_persona?: Persona
      }>(`/store/cityos/persona?tenant_id=${tenantId}`, {
        credentials: "include",
      })
      return response
    },
    enabled: !!tenantId,
  })
}

export function useResolvedPersona(tenantId: string) {
  const { data, ...rest } = usePersonas(tenantId)
  return { data: data?.resolved_persona, ...rest }
}
