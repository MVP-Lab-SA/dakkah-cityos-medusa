import { type ReactNode } from "react"
import { clsx } from "clsx"

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div className={clsx("space-y-2", className)}>
      {breadcrumbs && (
        <div className="text-xs text-gray-500">{breadcrumbs}</div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
