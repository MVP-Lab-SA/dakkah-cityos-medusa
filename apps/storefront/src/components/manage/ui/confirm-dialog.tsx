import { useEffect } from "react"
import { Spinner } from "@medusajs/icons"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) onClose()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open, onClose, loading])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
      />

      <div className="relative bg-ds-card rounded-lg shadow-xl w-full max-w-md p-6 animate-[fadeInScale_0.15s_ease-out]">
        <h2 className="text-base font-semibold text-ds-foreground">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-ds-muted-foreground">{description}</p>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-ds-border bg-ds-card px-3 py-2 text-sm font-medium text-ds-foreground/80 transition-colors hover:bg-ds-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ds-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-ds-destructive px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-ds-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ds-destructive disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Spinner className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
