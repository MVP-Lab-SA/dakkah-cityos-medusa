import { Button, Heading, Text } from "@medusajs/ui"

type ConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "default"
  loading?: boolean
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null

  const handleConfirm = () => {
    onConfirm()
    if (!loading) {
      onOpenChange(false)
    }
  }

  const confirmButtonClass = variant === "danger"
    ? "bg-ui-tag-red-bg text-ui-tag-red-text hover:bg-ui-tag-red-bg-hover"
    : variant === "warning"
    ? "bg-ui-tag-orange-bg text-ui-tag-orange-text hover:bg-ui-tag-orange-bg-hover"
    : ""

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-ui-bg-base rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <Heading level="h2" className="mb-2">{title}</Heading>
        <Text className="text-ui-fg-muted mb-6">{description}</Text>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={confirmButtonClass}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
