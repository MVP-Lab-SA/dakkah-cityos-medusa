import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type {
  ApprovalWorkflow,
  ApprovalRequest,
  ApprovalFilters,
} from "@/lib/types/approvals"

export function useApprovalWorkflows(companyId?: string) {
  return useQuery({
    queryKey: queryKeys.approvals.workflows(),
    queryFn: async () => {
      const params = companyId ? `?company_id=${companyId}` : ""
      const response = await sdk.client.fetch<{ workflows: ApprovalWorkflow[] }>(
        `/store/companies/me/approval-workflows${params}`,
        { credentials: "include" }
      )
      return response.workflows || []
    },
  })
}

export function useApprovalRequests(filters?: ApprovalFilters) {
  return useQuery({
    queryKey: queryKeys.approvals.requests(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.status) params.set("status", filters.status.join(","))
      if (filters?.entity_type) params.set("entity_type", filters.entity_type)
      if (filters?.created_after) params.set("created_after", filters.created_after)
      if (filters?.created_before) params.set("created_before", filters.created_before)

      const response = await sdk.client.fetch<{ requests: ApprovalRequest[]; count: number }>(
        `/store/companies/me/approval-requests?${params}`,
        { credentials: "include" }
      )
      return response
    },
  })
}

export function useApprovalRequest(requestId: string) {
  return useQuery({
    queryKey: queryKeys.approvals.requests(requestId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ request: ApprovalRequest }>(
        `/store/companies/me/approval-requests/${requestId}`,
        { credentials: "include" }
      )
      return response.request
    },
    enabled: !!requestId,
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ requestId, comment }: { requestId: string; comment?: string }) => {
      return sdk.client.fetch(`/store/companies/me/approval-requests/${requestId}/approve`, {
        method: "POST",
        credentials: "include",
        body: { comment },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all })
    },
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      return sdk.client.fetch(`/store/companies/me/approval-requests/${requestId}/reject`, {
        method: "POST",
        credentials: "include",
        body: { reason },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all })
    },
  })
}
