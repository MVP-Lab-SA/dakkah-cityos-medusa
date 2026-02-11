import { type ReactNode, useState, useEffect } from "react"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { Link } from "@tanstack/react-router"
import { RoleGuard } from "./role-guard"
import { ManageSidebar } from "./manage-sidebar"
import { ManageHeader } from "./manage-header"
import { ArrowLeftMini, BuildingStorefront } from "@medusajs/icons"

interface ManageLayoutProps {
  children: ReactNode
  locale?: string
}

export function ManageLayout({ children, locale: localeProp }: ManageLayoutProps) {
  const { locale: ctxLocale, tenantSlug } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (typeof window === "undefined") {
    return (
      <div className="min-h-screen bg-ds-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-ds-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-ds-muted">{t(locale, "common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard locale={locale}>
      <ManageLayoutClient locale={locale} tenantSlug={tenantSlug}>
        {children}
      </ManageLayoutClient>
    </RoleGuard>
  )
}

function ManageLayoutClient({ children, locale, tenantSlug }: { children: ReactNode; locale: string; tenantSlug: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (sidebarOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSidebarOpen(false)
      }
      document.addEventListener("keydown", handleEsc)
      return () => document.removeEventListener("keydown", handleEsc)
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-ds-background flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ds-background/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 w-[260px] bg-ds-card border-e border-ds-border rounded-e-xl shadow-sm flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-ds-border">
          <Link
            to={`/${tenantSlug}/${locale}/manage` as any}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-ds-primary rounded-lg flex items-center justify-center">
              <BuildingStorefront className="w-5 h-5 text-ds-primary-foreground" />
            </div>
            <span className="font-semibold text-ds-text">{t(locale, "manage.store_management")}</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3 transition-opacity duration-200">
          <ManageSidebar locale={locale} onNavigate={() => setSidebarOpen(false)} />
        </div>
        <div className="p-3 border-t border-ds-border">
          <Link
            to={`/${tenantSlug}/${locale}` as any}
            className="flex items-center gap-2 px-3 py-2 text-sm text-ds-muted hover:text-ds-foreground hover:bg-ds-accent rounded-lg transition-colors"
          >
            <ArrowLeftMini className="w-4 h-4" />
            {t(locale, "manage.back_to_store")}
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <ManageHeader locale={locale} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
