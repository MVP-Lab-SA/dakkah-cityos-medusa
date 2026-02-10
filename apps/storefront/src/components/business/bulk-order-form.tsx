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
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">Bulk Order Upload</h3>
        <p className="text-sm text-ds-muted-foreground mt-1">Upload a CSV file with SKUs and quantities</p>
      </div>

      <div className="p-6">
        {!file ? (
          <div className="border-2 border-dashed border-ds-border rounded-xl p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <ArrowUpTray className="w-12 h-12 text-ds-muted-foreground mx-auto mb-4" />
              <p className="text-ds-foreground font-medium mb-1">
                Drop your CSV file here or click to browse
              </p>
              <p className="text-sm text-ds-muted-foreground">
                CSV should have columns: SKU, Quantity
              </p>
            </label>
          </div>
        ) : (
          <div>
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-ds-muted rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <DocumentText className="w-8 h-8 text-ds-muted-foreground" />
                <div>
                  <p className="font-medium text-ds-foreground">{file.name}</p>
                  <p className="text-sm text-ds-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="p-2 hover:bg-ds-muted rounded-lg transition-colors"
              >
                <XMark className="w-5 h-5 text-ds-muted-foreground" />
              </button>
            </div>

            {/* Results */}
            {isUploading ? (
              <p className="text-center text-ds-muted-foreground py-4">Parsing file...</p>
            ) : parsedItems.length > 0 ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-ds-success rounded-lg">
                    <Check className="w-4 h-4 text-ds-success" />
                    <span className="text-sm text-ds-success">{validCount} valid items</span>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-ds-destructive rounded-lg">
                      <XMark className="w-4 h-4 text-ds-destructive" />
                      <span className="text-sm text-ds-destructive">{invalidCount} invalid items</span>
                    </div>
                  )}
                </div>

                {/* Item List Preview */}
                <div className="max-h-60 overflow-auto border border-ds-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-ds-muted sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-start">SKU</th>
                        <th className="px-4 py-2 text-start">Quantity</th>
                        <th className="px-4 py-2 text-start">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ds-border">
                      {parsedItems.slice(0, 10).map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 font-mono">{item.sku || "-"}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">
                            {item.valid ? (
                              <span className="text-ds-success">Valid</span>
                            ) : (
                              <span className="text-ds-destructive">{item.error}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedItems.length > 10 && (
                    <p className="px-4 py-2 text-sm text-ds-muted-foreground bg-ds-muted">
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
        <div className="px-6 py-4 border-t border-ds-border">
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
