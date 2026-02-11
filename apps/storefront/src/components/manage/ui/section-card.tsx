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
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200 ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}
