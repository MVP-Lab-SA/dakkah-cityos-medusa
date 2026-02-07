import { Button, Heading, Text } from "@medusajs/ui"
import { XMark } from "@medusajs/icons"

type FormDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  onSubmit?: () => void
  submitLabel?: string
  loading?: boolean
  size?: "small" | "medium" | "large"
}

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  size = "medium",
}: FormDrawerProps) {
  if (!open) return null

  const widthClass = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
  }[size]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Drawer */}
      <div className={`relative bg-ui-bg-base w-full ${widthClass} flex flex-col shadow-lg`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ui-border-base">
          <div>
            <Heading level="h2">{title}</Heading>
            {description && (
              <Text className="text-ui-fg-muted text-sm mt-1">{description}</Text>
            )}
          </div>
          <Button
            variant="transparent"
            size="small"
            onClick={() => onOpenChange(false)}
          >
            <XMark className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {onSubmit && (
          <div className="flex justify-end gap-2 p-4 border-t border-ui-border-base">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? "Saving..." : submitLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
