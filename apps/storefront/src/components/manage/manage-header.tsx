import { Link, useLocation } from "@tanstack/react-router"
import { useTenant } from "@/lib/context/tenant-context"
import { useAuth } from "@/lib/context/auth-context"
import { t } from "@/lib/i18n"
import { useManageRole } from "./role-guard"
import {
  BarsThree,
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

  const initial = customer?.first_name?.[0]?.toUpperCase() || "U"

  return (
    <header className="bg-white border-b border-gray-200 h-12 px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-1 rounded text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <BarsThree className="w-4 h-4" />
        </button>
        <nav className="hidden md:flex items-center gap-1 text-[13px] text-gray-400 min-w-0">
          <Link to={`/${tenantSlug}/${locale}` as any} className="hover:text-gray-600 transition-colors flex-shrink-0">
            {t(locale, "common.home")}
          </Link>
          <span className="text-gray-300 flex-shrink-0">/</span>
          <Link to={`/${tenantSlug}/${locale}/manage` as any} className="hover:text-gray-600 transition-colors flex-shrink-0">
            {t(locale, "manage.management")}
          </Link>
          {segments.map((seg, i) => (
            <span key={seg} className="flex items-center gap-1 min-w-0">
              <span className="text-gray-300 flex-shrink-0">/</span>
              {i === segments.length - 1 ? (
                <span className="text-gray-600 capitalize truncate">{seg.replace(/-/g, " ")}</span>
              ) : (
                <Link
                  to={`/${tenantSlug}/${locale}/manage/${segments.slice(0, i + 1).join("/")}` as any}
                  className="hover:text-gray-600 transition-colors capitalize truncate"
                >
                  {seg.replace(/-/g, " ")}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-medium cursor-pointer hover:bg-violet-200 transition-colors">
          {initial}
        </div>
      </div>
    </header>
  )
}
