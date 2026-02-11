import { Link, useLocation } from "@tanstack/react-router"
import { useTenant } from "@/lib/context/tenant-context"
import { useAuth } from "@/lib/context/auth-context"
import { t } from "@/lib/i18n"
import { useManageRole } from "./role-guard"
import {
  BarsThree,
  BellAlert,
  ArrowUpRightOnBox,
} from "@medusajs/icons"

interface ManageHeaderProps {
  locale?: string
  onMenuToggle?: () => void
}

export function ManageHeader({ locale: localeProp, onMenuToggle }: ManageHeaderProps) {
  const { locale: ctxLocale, tenantSlug, tenant } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const { customer } = useAuth()
  const { role } = useManageRole()
  const location = useLocation()

  const segments = location.pathname
    .replace(`/${tenantSlug}/${locale}/manage`, "")
    .split("/")
    .filter(Boolean)

  return (
    <header className="bg-ds-card border-b border-ds-border px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-ds-muted hover:bg-ds-accent hover:text-ds-foreground transition-colors"
          >
            <BarsThree className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-ds-text">
              {tenant?.name || tenantSlug}
            </h1>
            <nav className="hidden md:flex items-center gap-1 text-xs text-ds-muted">
              <Link to={`/${tenantSlug}/${locale}` as any} className="hover:text-ds-text transition-colors">
                {t(locale, "common.home")}
              </Link>
              <span className="text-ds-border">/</span>
              <Link to={`/${tenantSlug}/${locale}/manage` as any} className="hover:text-ds-text transition-colors">
                {t(locale, "manage.management")}
              </Link>
              {segments.map((seg, i) => (
                <span key={seg} className="flex items-center gap-1">
                  <span className="text-ds-border">/</span>
                  {i === segments.length - 1 ? (
                    <span className="text-ds-text capitalize">{seg}</span>
                  ) : (
                    <Link
                      to={`/${tenantSlug}/${locale}/manage/${segments.slice(0, i + 1).join("/")}` as any}
                      className="hover:text-ds-text transition-colors capitalize"
                    >
                      {seg}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/${tenantSlug}/${locale}` as any}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ds-muted hover:text-ds-text hover:bg-ds-accent rounded-lg transition-colors"
          >
            <ArrowUpRightOnBox className="w-3.5 h-3.5" />
            {t(locale, "manage.view_store")}
          </Link>
          <button
            type="button"
            className="relative p-2 rounded-lg text-ds-muted hover:bg-ds-accent hover:text-ds-foreground transition-colors"
          >
            <BellAlert className="w-5 h-5" />
            <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-ds-primary rounded-full" />
          </button>
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
