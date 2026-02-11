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
  const { locale: ctxLocale, tenantSlug } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const { customer } = useAuth()
  const location = useLocation()

  const segments = location.pathname
    .replace(`/${tenantSlug}/${locale}/manage`, "")
    .split("/")
    .filter(Boolean)

  return (
    <header className="bg-ds-background border-b border-ds-border/40 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded text-ds-muted hover:text-ds-text hover:bg-ds-card transition-colors flex-shrink-0"
        >
          <BarsThree className="w-5 h-5" />
        </button>
        <nav className="hidden md:flex items-center gap-1 text-sm text-ds-muted min-w-0">
          <Link to={`/${tenantSlug}/${locale}` as any} className="hover:text-ds-text transition-colors flex-shrink-0">
            {t(locale, "common.home")}
          </Link>
          <span className="text-ds-border/60 flex-shrink-0">/</span>
          <Link to={`/${tenantSlug}/${locale}/manage` as any} className="hover:text-ds-text transition-colors flex-shrink-0">
            {t(locale, "manage.management")}
          </Link>
          {segments.map((seg, i) => (
            <span key={seg} className="flex items-center gap-1 min-w-0">
              <span className="text-ds-border/60 flex-shrink-0">/</span>
              {i === segments.length - 1 ? (
                <span className="text-ds-text capitalize truncate">{seg}</span>
              ) : (
                <Link
                  to={`/${tenantSlug}/${locale}/manage/${segments.slice(0, i + 1).join("/")}` as any}
                  className="hover:text-ds-text transition-colors capitalize truncate"
                >
                  {seg}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-ds-accent flex items-center justify-center text-ds-text text-sm font-medium cursor-pointer hover:bg-ds-card transition-colors">
          {customer?.first_name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  )
}
