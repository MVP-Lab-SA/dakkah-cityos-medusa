import type { ReactNode } from "react"
import { useTenant } from "@/lib/context/tenant-context"

interface HelpCenterLayoutProps {
  sidebar?: ReactNode
  children?: ReactNode
  locale?: string
}

export function HelpCenterLayout({ sidebar, children, locale: localeProp }: HelpCenterLayoutProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {sidebar && (
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-4">{sidebar}</div>
        </aside>
      )}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
