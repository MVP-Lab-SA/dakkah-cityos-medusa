import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpTray, DocumentText, XMark, Check } from "@medusajs/icons"

interface ParsedItem {
  sku: string
  quantity: number
  valid: boolean
  error?: string
}

interface BulkOrderFormProps {
  onSubmit?: (items: ParsedItem[]) => Promise<void>
}

export function BulkOrderForm({ onSubmit }: BulkOrderFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsUploading(true)

    // Parse CSV
    try {
      const text = await selectedFile.text()
      const lines = text.split("\n").filter((line) => line.trim())
      
      // Skip header row if exists
      const startIndex = lines[0]?.toLowerCase().includes("sku") ? 1 : 0
      
      const items: ParsedItem[] = lines.slice(startIndex).map((line) => {
        const parts = line.split(",").map((p) => p.trim())
        const sku = parts[0] || ""
        const quantity = parseInt(parts[1]) || 0

        if (!sku) {
          return { sku, quantity, valid: false, error: "Missing SKU" }
        }
        if (quantity <= 0) {
          return { sku, quantity, valid: false, error: "Invalid quantity" }
        }
        return { sku, quantity, valid: true }
      })

      setParsedItems(items)
    } catch (error) {
      console.error("Error parsing file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setParsedItems([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    const validItems = parsedItems.filter((item) => item.valid)
    if (validItems.length === 0 || !onSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(validItems)
      clearFile()
    } finally {
      setIsSubmitting(false)
    }
  }

  const validCount = parsedItems.filter((item) => item.valid).length
  const invalidCount = parsedItems.filter((item) => !item.valid).length

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900">Bulk Order Upload</h3>
        <p className="text-sm text-zinc-500 mt-1">Upload a CSV file with SKUs and quantities</p>
      </div>

      <div className="p-6">
        {!file ? (
          <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <ArrowUpTray className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-900 font-medium mb-1">
                Drop your CSV file here or click to browse
              </p>
              <p className="text-sm text-zinc-500">
                CSV should have columns: SKU, Quantity
              </p>
            </label>
          </div>
        ) : (
          <div>
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <DocumentText className="w-8 h-8 text-zinc-600" />
                <div>
                  <p className="font-medium text-zinc-900">{file.name}</p>
                  <p className="text-sm text-zinc-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="p-2 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                <XMark className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Results */}
            {isUploading ? (
              <p className="text-center text-zinc-500 py-4">Parsing file...</p>
            ) : parsedItems.length > 0 ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">{validCount} valid items</span>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                      <XMark className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">{invalidCount} invalid items</span>
                    </div>
                  )}
                </div>

                {/* Item List Preview */}
                <div className="max-h-60 overflow-auto border border-zinc-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">SKU</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {parsedItems.slice(0, 10).map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-mono">{item.sku || "-"}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">
                            {item.valid ? (
                              <span className="text-green-600">Valid</span>
                            ) : (
                              <span className="text-red-600">{item.error}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedItems.length > 10 && (
                    <p className="px-4 py-2 text-sm text-zinc-500 bg-zinc-50">
                      And {parsedItems.length - 10} more items...
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {parsedItems.length > 0 && validCount > 0 && (
        <div className="px-6 py-4 border-t border-zinc-200">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Adding to Cart..." : `Add ${validCount} Items to Cart`}
          </Button>
        </div>
      )}
    </div>
  )
}
