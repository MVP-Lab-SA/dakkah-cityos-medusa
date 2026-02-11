import { Link } from "@tanstack/react-router"
import { useTenant } from "@/lib/context/tenant-context"
import { useAuth } from "@/lib/context/auth-context"
import { t } from "@/lib/i18n"
import { useManageRole } from "./role-guard"

interface ManageHeaderProps {
  locale?: string
  onMenuToggle?: () => void
}

export function ManageHeader({ locale: localeProp, onMenuToggle }: ManageHeaderProps) {
  const { locale: ctxLocale, tenantSlug, tenant } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const { customer } = useAuth()
  const { role } = useManageRole()

  return (
    <header className="bg-ds-card border-b border-ds-border px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-ds-muted hover:bg-ds-accent hover:text-ds-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-ds-text">
              {tenant?.name || tenantSlug}
            </h1>
            <nav className="hidden md:flex items-center gap-1 text-xs text-ds-muted">
              <Link to={`/${tenantSlug}/${locale}` as any} className="hover:text-ds-text transition-colors">
                {t(locale, "common.home")}
              </Link>
              <span>/</span>
              <span>{t(locale, "manage.management")}</span>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {role && (
            <span className="hidden sm:inline-flex px-2.5 py-1 bg-ds-primary/10 text-ds-primary text-xs font-medium rounded-full">
              {role}
            </span>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ds-accent flex items-center justify-center text-ds-text text-sm font-medium">
              {customer?.first_name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="hidden md:inline text-sm text-ds-text">
              {customer?.first_name || customer?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
