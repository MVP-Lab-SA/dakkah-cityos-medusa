import { createFileRoute } from "@tanstack/react-router"
import { ReturnsCenter } from "@/components/returns/returns-center"
import { t } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/returns/")({
  component: ReturnsPage,
})

const demoReturns = [
  {
    id: "RET-001",
    orderId: "ORD-12345",
    status: "shipped" as const,
    itemCount: 2,
    refundAmount: { amount: 79.99, currency: "USD" },
    createdAt: "2026-02-08T10:00:00Z",
    updatedAt: "2026-02-10T14:30:00Z",
  },
  {
    id: "RET-002",
    orderId: "ORD-12340",
    status: "refunded" as const,
    itemCount: 1,
    refundAmount: { amount: 29.99, currency: "USD" },
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-06T16:00:00Z",
  },
]

function ReturnsPage() {
  const { locale } = Route.useParams()

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ReturnsCenter
          returns={demoReturns}
          onViewReturn={(id) => console.log("View return:", id)}
          onStartReturn={() => console.log("Start new return")}
          locale={locale}
        />
      </div>
    </div>
  )
}
