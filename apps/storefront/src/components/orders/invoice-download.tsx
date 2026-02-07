import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DocumentText, ArrowDownTray, Check } from "@medusajs/icons"

interface InvoiceDownloadProps {
  orderId: string
  displayId: string
  onDownload?: () => Promise<void>
}

export function InvoiceDownload({ orderId, displayId, onDownload }: InvoiceDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      if (onDownload) {
        await onDownload()
      } else {
        // Default: simulate download
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // In real implementation, would fetch PDF from backend
        console.log(`Downloading invoice for order ${orderId}`)
      }
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (error) {
      console.error("Failed to download invoice:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
          <DocumentText className="w-6 h-6 text-zinc-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-900">Invoice</h3>
          <p className="text-sm text-zinc-500 mt-0.5">
            Invoice for Order #{displayId}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Downloaded
              </>
            ) : isDownloading ? (
              "Generating..."
            ) : (
              <>
                <ArrowDownTray className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
