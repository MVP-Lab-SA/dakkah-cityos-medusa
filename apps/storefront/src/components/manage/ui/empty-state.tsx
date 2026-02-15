import { type ReactNode } from "react"
import { clsx } from "clsx"
import { InboxSolid } from "@medusajs/icons"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={clsx("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="text-ds-muted-foreground/50 mb-4">
        {icon || <InboxSolid className="w-12 h-12" />}
      </div>
      <h3 className="text-sm font-semibold text-ds-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-ds-muted-foreground max-w-sm">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}
