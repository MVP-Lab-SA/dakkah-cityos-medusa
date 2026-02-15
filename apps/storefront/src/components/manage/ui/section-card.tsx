import { type ReactNode } from "react"
import { clsx } from "clsx"

interface SectionCardProps {
  title?: string
  subtitle?: string
  headerAction?: ReactNode
  children: ReactNode
  noPadding?: boolean
  className?: string
}

export function SectionCard({ title, subtitle, headerAction, children, noPadding, className }: SectionCardProps) {
  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-lg overflow-hidden divide-y divide-ds-border", className)}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-ds-foreground">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-ds-muted-foreground">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}
      <div className={noPadding ? "" : "px-6 py-4"}>{children}</div>
    </div>
  )
}
