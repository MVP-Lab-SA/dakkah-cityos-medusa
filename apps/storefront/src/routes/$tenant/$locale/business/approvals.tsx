import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AccountLayout } from "@/components/account"
import { ApprovalQueue } from "@/components/business"
import { Spinner } from "@medusajs/icons"
import { useToast } from "@/components/ui/toast"
import { getBackendUrl, fetchWithTimeout } from "@/lib/utils/env"

export const Route = createFileRoute("/$tenant/$locale/business/approvals")({
  component: ApprovalsPage,
  head: () => ({
    meta: [
      { title: "Business Approvals | Dakkah CityOS" },
      { name: "description", content: "Manage business approvals on Dakkah CityOS" },
    ],
  }),
})

function ApprovalsPage() {
  const { tenant, locale } = Route.useParams()
  const backendUrl = getBackendUrl()
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  // Fetch pending approvals from multiple sources
  const { data, isLoading, error } = useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async () => {
      // Fetch pending purchase orders
      const [poResponse, quotesResponse] = await Promise.all([
        fetchWithTimeout(`${backendUrl}/store/purchase-orders?status=pending_approval`, {
          credentials: "include",
        }),
        fetchWithTimeout(`${backendUrl}/store/quotes?status=pending_approval`, {
          credentials: "include",
        }),
      ])

      const [poData, quotesData] = await Promise.all([
        poResponse.ok ? poResponse.json() : { purchase_orders: [] },
        quotesResponse.ok ? quotesResponse.json() : { quotes: [] },
      ])

      // Transform to approval items
      const purchaseOrderApprovals = (poData.purchase_orders || []).map((po: any) => ({
        id: po.id,
        type: "purchase_order" as const,
        title: `PO-${po.display_id || po.id.slice(0, 8)}`,
        requestedBy: po.customer?.first_name
          ? `${po.customer.first_name} ${po.customer.last_name || ""}`
          : "Unknown",
        requestedAt: po.created_at,
        amount: po.total,
        currencyCode: po.currency_code || "usd",
        details: po.notes || `${po.items?.length || 0} items`,
      }))

      const quoteApprovals = (quotesData.quotes || []).map((quote: any) => ({
        id: quote.id,
        type: "quote_request" as const,
        title: `Quote REQ-${quote.display_id || quote.id.slice(0, 8)}`,
        requestedBy: quote.customer?.first_name
          ? `${quote.customer.first_name} ${quote.customer.last_name || ""}`
          : "Unknown",
        requestedAt: quote.created_at,
        amount: quote.total,
        currencyCode: quote.currency_code || "usd",
        details: quote.notes || `${quote.items?.length || 0} items`,
      }))

      return [...purchaseOrderApprovals, ...quoteApprovals]
    },
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: string }) => {
      const endpoint =
        type === "purchase_order"
          ? `${backendUrl}/store/purchase-orders/${id}/approve`
          : `${backendUrl}/store/quotes/${id}/approve`

      const response = await fetchWithTimeout(endpoint, {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Failed to approve")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] })
      addToast("success", "Request approved successfully")
    },
    onError: (err: any) => {
      addToast("error", err.message || "Failed to approve request")
    },
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: string }) => {
      const endpoint =
        type === "purchase_order"
          ? `${backendUrl}/store/purchase-orders/${id}/reject`
          : `${backendUrl}/store/quotes/${id}/decline`

      const response = await fetchWithTimeout(endpoint, {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Failed to reject")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] })
      addToast("success", "Request rejected")
    },
    onError: (err: any) => {
      addToast("error", err.message || "Failed to reject request")
    },
  })

  const handleApprove = async (id: string) => {
    const item = data?.find((i: any) => i.id === id)
    if (item) {
      await approveMutation.mutateAsync({ id, type: item.type })
    }
  }

  const handleReject = async (id: string) => {
    const item = data?.find((i: any) => i.id === id)
    if (item) {
      await rejectMutation.mutateAsync({ id, type: item.type })
    }
  }

  return (
    <AccountLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ds-foreground">Approval Queue</h1>
        <p className="text-ds-muted-foreground mt-1">Review and approve pending requests</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-6 h-6 animate-spin text-ds-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="bg-ds-destructive border border-ds-destructive rounded-lg p-4 text-ds-destructive">
          Failed to load pending approvals. Please try again later.
        </div>
      )}

      {!isLoading && !error && (
        <ApprovalQueue
          items={data || []}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </AccountLayout>
  )
}
