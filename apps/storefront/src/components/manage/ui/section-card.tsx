import { type ReactNode } from "react"

interface SectionCardProps {
  title?: string
  subtitle?: string
  headerAction?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, subtitle, headerAction, children, className = "" }: SectionCardProps) {
  return (
    <div className={`bg-ds-card border border-ds-border rounded-lg overflow-hidden ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-ds-border">
          <div>
            {title && <h3 className="text-sm font-semibold text-ds-text">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-ds-muted">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
