import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { ApprovalQueue } from "@/components/business"

export const Route = createFileRoute("/$countryCode/business/approvals")({
  component: ApprovalsPage,
})

function ApprovalsPage() {
  const { countryCode } = Route.useParams()

  // Mock pending approvals
  const pendingApprovals = [
    {
      id: "po_1",
      type: "purchase_order" as const,
      title: "PO-123456",
      requestedBy: "Sarah Buyer",
      requestedAt: "2024-12-18T10:30:00Z",
      amount: 2500,
      currencyCode: "usd",
      details: "Office supplies and equipment for Q1",
    },
    {
      id: "limit_1",
      type: "limit_increase" as const,
      title: "Spending Limit Increase",
      requestedBy: "Mike Jones",
      requestedAt: "2024-12-17T14:00:00Z",
      amount: 10000,
      currencyCode: "usd",
      details: "Request to increase monthly spending limit from $5,000 to $10,000",
    },
    {
      id: "quote_1",
      type: "quote_request" as const,
      title: "Quote REQ-789",
      requestedBy: "Sarah Buyer",
      requestedAt: "2024-12-16T09:15:00Z",
      amount: 15000,
      currencyCode: "usd",
      details: "Bulk order quote for 500 units",
    },
  ]

  const handleApprove = async (id: string) => {
    console.log("Approving:", id)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const handleReject = async (id: string) => {
    console.log("Rejecting:", id)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return (
    <AccountLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Approval Queue</h1>
        <p className="text-zinc-500 mt-1">Review and approve pending requests</p>
      </div>

      <ApprovalQueue
        items={pendingApprovals}
        countryCode={countryCode}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </AccountLayout>
  )
}
