import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/sdk"
import { formatPrice } from "@/lib/utils/prices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VendorCommissions() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "transactions"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/vendor/transactions", {
        credentials: "include",
      })
      return response.json()
    },
  })

  if (isLoading) {
    return <CommissionsSkeleton />
  }

  const { transactions } = data

  const approved = transactions.filter((t: any) => t.status === "approved")
  const pending = transactions.filter((t: any) => t.status === "pending")
  const paid = transactions.filter((t: any) => t.payout_status === "paid")

  const totalEarnings = approved.reduce((sum: number, t: any) => sum + Number(t.net_amount), 0)
  const totalCommission = approved.reduce((sum: number, t: any) => sum + Number(t.commission_amount), 0)
  const pendingEarnings = pending.reduce((sum: number, t: any) => sum + Number(t.net_amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Commission Tracking</h1>
        <p className="text-muted-foreground mt-2">
          View your earnings and commission breakdown
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-2xl">
              {formatPrice(totalEarnings, "USD")}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Commission Paid</CardDescription>
            <CardTitle className="text-2xl">
              {formatPrice(totalCommission, "USD")}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending Earnings</CardDescription>
            <CardTitle className="text-2xl">
              {formatPrice(pendingEarnings, "USD")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Transaction List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid Out ({paid.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <TransactionList transactions={transactions} />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          <TransactionList transactions={approved} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          <TransactionList transactions={pending} />
        </TabsContent>

        <TabsContent value="paid" className="space-y-4 mt-4">
          <TransactionList transactions={paid} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TransactionList({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No transactions found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {transactions.map((transaction: any) => (
            <div key={transaction.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{transaction.order_id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatPrice(transaction.net_amount, transaction.currency_code)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Commission: {formatPrice(transaction.commission_amount, transaction.currency_code)}
                </p>
              </div>
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    transaction.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : transaction.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CommissionsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
