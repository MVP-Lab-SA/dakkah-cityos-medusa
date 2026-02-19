import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Company, CompanyMember, CreditInfo } from "@/lib/types/companies"
import { getServerBaseUrl, fetchWithTimeout } from "@/lib/utils/env"

export function useMyCompany() {
  const backendUrl = getServerBaseUrl()

  return useQuery({
    queryKey: ["my-company"],
    queryFn: async () => {
      const response = await fetchWithTimeout(
        `${backendUrl}/store/companies/me`,
        { credentials: "include" },
      )

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error("Failed to fetch company")
      }
      const data = await response.json()
      return data.company as Company
    },
  })
}

export function useCompanyTeam() {
  const backendUrl = getServerBaseUrl()

  return useQuery({
    queryKey: ["company-team"],
    queryFn: async () => {
      const response = await fetchWithTimeout(
        `${backendUrl}/store/companies/me/team`,
        { credentials: "include" },
      )

      if (!response.ok) throw new Error("Failed to fetch team")
      const data = await response.json()
      return data.members as CompanyMember[]
    },
  })
}

export function useCompanyCredit() {
  const backendUrl = getServerBaseUrl()

  return useQuery({
    queryKey: ["company-credit"],
    queryFn: async () => {
      const response = await fetchWithTimeout(
        `${backendUrl}/store/companies/me/credit`,
        { credentials: "include" },
      )

      if (!response.ok) throw new Error("Failed to fetch credit info")
      const data = await response.json()
      return data.credit as CreditInfo
    },
  })
}

export function useCompanyOrders() {
  const backendUrl = getServerBaseUrl()

  return useQuery({
    queryKey: ["company-orders"],
    queryFn: async () => {
      const response = await fetchWithTimeout(
        `${backendUrl}/store/companies/me/orders`,
        { credentials: "include" },
      )

      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      return data.orders
    },
  })
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient()
  const backendUrl = getServerBaseUrl()

  return useMutation({
    mutationFn: async (data: {
      email: string
      role: CompanyMember["role"]
      spending_limit?: number
    }) => {
      const response = await fetchWithTimeout(
        `${backendUrl}/store/companies/me/team/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        },
      )

      if (!response.ok) throw new Error("Failed to invite team member")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-team"] })
    },
  })
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient()
  const backendUrl = getServerBaseUrl()

  return useMutation({
    mutationFn: async ({
      memberId,
      data,
    }: {
      memberId: string
      data: Partial<CompanyMember>
    }) => {
      const response = await fetchWithTimeout(
        `${backendUrl}/store/companies/me/team/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        },
      )

      if (!response.ok) throw new Error("Failed to update team member")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-team"] })
    },
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()
  const backendUrl = getServerBaseUrl()

  return useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetchWithTimeout(
        `${backendUrl}/store/companies/me/team/${memberId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      )

      if (!response.ok) throw new Error("Failed to remove team member")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-team"] })
    },
  })
}
