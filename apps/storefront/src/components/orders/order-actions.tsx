import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ArrowPath, DocumentText, ArrowUturnLeft, ChatBubbleLeftRight } from "@medusajs/icons"

interface OrderActionsProps {
  orderId: string
  status: string
  countryCode: string
  onReorder?: () => void
  onDownloadInvoice?: () => void
}

export function OrderActions({
  orderId,
  status,
  countryCode,
  onReorder,
  onDownloadInvoice,
}: OrderActionsProps) {
  const canReturn = ["delivered", "completed"].includes(status.toLowerCase())
  const canTrack = ["shipped", "processing"].includes(status.toLowerCase())

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Actions</h3>
      
      <div className="space-y-3">
        {/* Reorder */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onReorder}
        >
          <ArrowPath className="w-4 h-4 mr-2" />
          Reorder Items
        </Button>

        {/* Download Invoice */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onDownloadInvoice}
        >
          <DocumentText className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>

        {/* Track Order */}
        {canTrack && (
          <Link to={`/${countryCode}/account/orders/${orderId}/track`}>
            <Button variant="outline" className="w-full justify-start">
              <DocumentText className="w-4 h-4 mr-2" />
              Track Shipment
            </Button>
          </Link>
        )}

        {/* Return Request */}
        {canReturn && (
          <Link to={`/${countryCode}/account/orders/${orderId}/return`}>
            <Button variant="outline" className="w-full justify-start">
              <ArrowUturnLeft className="w-4 h-4 mr-2" />
              Request Return
            </Button>
          </Link>
        )}

        {/* Get Help */}
        <Button variant="ghost" className="w-full justify-start text-zinc-600">
          <ChatBubbleLeftRight className="w-4 h-4 mr-2" />
          Get Help with Order
        </Button>
      </div>
    </div>
  )
}
