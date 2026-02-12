import React, { useState, useRef } from "react"

interface DisputeFormProps {
  orderId: string
  orderNumber?: string
}

type DisputeReason = "wrong_item" | "damaged" | "not_received" | "quality" | "other"

const reasonLabels: Record<DisputeReason, string> = {
  wrong_item: "Wrong Item Received",
  damaged: "Item Damaged",
  not_received: "Item Not Received",
  quality: "Quality Issue",
  other: "Other",
}

export function DisputeForm({ orderId, orderNumber }: DisputeFormProps) {
  const [reason, setReason] = useState<DisputeReason | "">("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason || !description) return

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="bg-ds-card rounded-xl border border-ds-border p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">
          Dispute filed successfully
        </h3>
        <p className="text-sm text-ds-muted-foreground">
          We'll review your dispute within 48 hours. You'll receive a notification with the outcome.
        </p>
        {orderNumber && (
          <p className="text-xs text-ds-muted-foreground mt-2">
            Reference: Order #{orderNumber}
          </p>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-ds-card rounded-xl border border-ds-border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-ds-foreground">File a Dispute</h3>
        <p className="text-sm text-ds-muted-foreground mt-1">
          Order #{orderNumber || orderId}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-2">
          Reason for Dispute
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as DisputeReason)}
          required
          className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
        >
          <option value="">Select a reason</option>
          {(Object.keys(reasonLabels) as DisputeReason[]).map((key) => (
            <option key={key} value={key}>
              {reasonLabels[key]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Please describe the issue in detail..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-background text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ds-foreground mb-2">
          Evidence (optional)
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-ds-border rounded-lg p-6 text-center cursor-pointer hover:border-ds-primary/50 hover:bg-ds-muted/50 transition-colors"
        >
          <svg className="w-8 h-8 mx-auto text-ds-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-ds-muted-foreground">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-ds-muted-foreground mt-1">
            Images, PDFs, or documents
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 bg-ds-muted rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-ds-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm text-ds-foreground truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="text-ds-destructive text-sm font-medium ms-2 flex-shrink-0 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!reason || !description || submitting}
        className="w-full py-2.5 text-sm font-semibold rounded-lg bg-ds-destructive text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Dispute"}
      </button>
    </form>
  )
}
