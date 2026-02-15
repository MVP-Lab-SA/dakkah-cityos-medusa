// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useAuth } from "@/lib/context/auth-context"
import { useState, useMemo } from "react"

interface Transaction {
  id: string
  type: string
  amount: number
  currency_code: string
  status: string
  reference: string
  description?: string
  created_at: string
}

export const Route = createFileRoute("/$tenant/$locale/vendor/transactions")({
  component: VendorTransactionsRoute,
})

function VendorTransactionsRoute() {
  const auth = useAuth()
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  const vendorId = useMemo(() => {
    const user = (auth as any)?.user || (auth as any)?.customer
    if (user?.vendor_id) return user.vendor_id
    if (user?.metadata?.vendor_id) return user.metadata.vendor_id
    if (user?.id) return user.id
    return "current-vendor"
  }, [auth])

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-transactions", typeFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (typeFilter) params.set("type", typeFilter)
      if (statusFilter) params.set("status", statusFilter)
      const url = `/vendor/transactions${params.toString() ? `?${params}` : ""}`
      return sdk.client.fetch<{ items: Transaction[]; count: number }>(url, {
        credentials: "include",
      })
    },
  })

  const items = data?.items || []

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-ds-muted text-ds-foreground",
  }

  const typeColors: Record<string, string> = {
    sale: "bg-green-50 text-green-700",
    refund: "bg-red-50 text-red-700",
    payout: "bg-blue-50 text-blue-700",
    fee: "bg-orange-50 text-orange-700",
    adjustment: "bg-purple-50 text-purple-700",
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-ds-muted-foreground">Type:</span>
          {["", "sale", "refund", "payout", "fee", "adjustment"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                typeFilter === t ? "bg-blue-600 text-white border-blue-600" : "bg-ds-card hover:bg-ds-muted/50"
              }`}
            >
              {t || "All"}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-ds-muted-foreground">Status:</span>
          {["", "completed", "pending", "processing", "failed", "refunded"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-full border transition ${
                statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-ds-card hover:bg-ds-muted/50"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-ds-muted-foreground">
          <p className="text-lg mb-2">No transactions yet</p>
          <p className="text-sm">Your transaction history will appear here once you start receiving orders.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-ds-muted-foreground">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Reference</th>
                <th className="pb-3 pr-4">Description</th>
                <th className="pb-3 pr-4 text-right">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-ds-muted/50 transition">
                  <td className="py-4 pr-4 text-sm text-ds-muted-foreground">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${typeColors[txn.type] || "bg-ds-muted/50 text-ds-foreground/80"}`}>
                      {txn.type?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-sm font-mono text-ds-muted-foreground">{txn.reference || "—"}</td>
                  <td className="py-4 pr-4 text-sm text-ds-muted-foreground">{txn.description || "—"}</td>
                  <td className="py-4 pr-4 text-right font-medium">
                    <span className={txn.type === "refund" || txn.type === "fee" ? "text-red-600" : "text-green-600"}>
                      {txn.type === "refund" || txn.type === "fee" ? "−" : "+"}{txn.currency_code?.toUpperCase()} {(Math.abs(txn.amount) / 100).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[txn.status] || "bg-ds-muted text-ds-foreground"}`}>
                      {txn.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}