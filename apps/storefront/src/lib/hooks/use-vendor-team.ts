import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { VendorUser } from "@/lib/types/vendors"

export function useVendorTeam() {
  return useQuery({
    queryKey: queryKeys.vendorTeam.all,
    queryFn: async () => {
      const response = await sdk.client.fetch<{ members: VendorUser[] }>(
        "/vendor/team",
        { credentials: "include" },
      )
      return response.members || []
    },
  })
}

export function useInviteVendorTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      email: string
      role: VendorUser["role"]
      permissions?: string[]
    }) => {
      return sdk.client.fetch("/vendor/team/invite", {
        method: "POST",
        credentials: "include",
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendorTeam.all })
    },
  })
}

export function useUpdateVendorTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      memberId,
      data,
    }: {
      memberId: string
      data: Partial<VendorUser>
    }) => {
      return sdk.client.fetch(`/vendor/team/${memberId}`, {
        method: "PUT",
        credentials: "include",
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendorTeam.all })
    },
  })
}

export function useRemoveVendorTeamMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      return sdk.client.fetch(`/vendor/team/${memberId}`, {
        method: "DELETE",
        credentials: "include",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendorTeam.all })
    },
  })
}
