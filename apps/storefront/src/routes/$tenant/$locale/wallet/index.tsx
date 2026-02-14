// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/wallet/")({
  component: WalletPage,
})

function WalletPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error } = useQuery({
    queryKey: ["wallet", page],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set("limit", String(limit))
      params.set("offset", String((page - 1) * limit))
      const qs = params.toString()
      const response = await sdk.client.fetch<{ wallet: any; transactions: any[]; count: number }>(
        `/store/wallet${qs ? `?${qs}` : ""}`,
        { method: "GET", credentials: "include" }
      )
      return response
    },
  })

  const wallet = data?.wallet || null
  const transactions = data?.transactions || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  const filteredTransactions = transactions.filter((tx) =>
    searchQuery ? tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) || tx.type?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  function txTypeColor(type: string) {
    switch (type) {
      case "credit": case "deposit": case "refund": return "text-green-600"
      case "debit": case "withdrawal": case "purchase": return "text-red-600"
      default: return "text-ds-foreground"
    }
  }

  function txTypeIcon(type: string) {
    switch (type) {
      case "credit": case "deposit": case "refund": return "+"
      case "debit": case "withdrawal": case "purchase": return "-"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Wallet</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">My Wallet</h1>
          <p className="mt-2 text-ds-muted-foreground">Manage your balance, view transactions, and add funds</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-ds-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-ds-destructive font-medium">Something went wrong loading your wallet.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            <div className="bg-ds-background border border-ds-border rounded-xl p-8">
              <div className="h-8 w-1/3 bg-ds-muted rounded animate-pulse mb-4" />
              <div className="h-12 w-1/2 bg-ds-muted rounded animate-pulse mb-4" />
              <div className="h-10 w-32 bg-ds-muted rounded-lg animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-ds-background border border-ds-border rounded-xl p-4 flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-1/3 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-1/4 bg-ds-muted rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-ds-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-ds-primary/10 to-ds-primary/5 border border-ds-primary/20 rounded-xl p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ds-muted-foreground mb-1">Available Balance</p>
                  <p className="text-4xl font-bold text-ds-foreground">
                    ${wallet?.balance !== undefined ? Number(wallet.balance).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
                  </p>
                  {wallet?.pending_balance > 0 && (
                    <p className="text-sm text-ds-muted-foreground mt-1">
                      ${Number(wallet.pending_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} pending
                    </p>
                  )}
                </div>
                <button className="px-6 py-3 bg-ds-primary text-ds-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Add Funds
                </button>
              </div>
              {wallet?.currency && (
                <p className="text-xs text-ds-muted-foreground mt-4">Currency: {wallet.currency.toUpperCase()}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-ds-foreground">Recent Transactions</h2>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-64 px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
                />
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
                  <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-ds-foreground mb-2">No transactions yet</h3>
                  <p className="text-ds-muted-foreground text-sm">Your transaction history will appear here.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {filteredTransactions.map((tx: any) => (
                      <div key={tx.id} className="bg-ds-background border border-ds-border rounded-xl p-4 flex items-center justify-between hover:border-ds-primary/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${tx.type === "credit" || tx.type === "deposit" || tx.type === "refund" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                            {txTypeIcon(tx.type)}
                          </div>
                          <div>
                            <p className="font-medium text-ds-foreground">{tx.description || tx.type || "Transaction"}</p>
                            <p className="text-xs text-ds-muted-foreground">
                              {tx.created_at ? new Date(tx.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                            </p>
                          </div>
                        </div>
                        <span className={`text-lg font-semibold ${txTypeColor(tx.type)}`}>
                          {txTypeIcon(tx.type)}${Math.abs(Number(tx.amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                      <span className="text-sm text-ds-muted-foreground">Page {page} of {totalPages}</span>
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm rounded-lg border border-ds-border text-ds-foreground hover:bg-ds-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
