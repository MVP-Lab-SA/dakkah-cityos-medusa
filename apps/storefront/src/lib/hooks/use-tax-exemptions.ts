import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { TaxExemption } from "@/lib/types/approvals"

export function useTaxExemptions() {
  return useQuery({
    queryKey: queryKeys.taxExemptions.all,
    queryFn: async () => {
      const response = await sdk.client.fetch<{ exemptions: TaxExemption[] }>(
        "/store/companies/me/tax-exemptions",
        { credentials: "include" },
      )
      return response.exemptions || []
    },
  })
}

export function useTaxExemption(exemptionId: string) {
  return useQuery({
    queryKey: queryKeys.taxExemptions.detail(exemptionId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ exemption: TaxExemption }>(
        `/store/companies/me/tax-exemptions/${exemptionId}`,
        { credentials: "include" },
      )
      return response.exemption
    },
    enabled: !!exemptionId,
  })
}

export function useCreateTaxExemption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<TaxExemption>) => {
      return sdk.client.fetch("/store/companies/me/tax-exemptions", {
        method: "POST",
        credentials: "include",
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxExemptions.all })
    },
  })
}

export function useDeleteTaxExemption() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (exemptionId: string) => {
      return sdk.client.fetch(
        `/store/companies/me/tax-exemptions/${exemptionId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxExemptions.all })
    },
  })
}
