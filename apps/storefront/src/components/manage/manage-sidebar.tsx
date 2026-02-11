import { Link, useLocation } from "@tanstack/react-router"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { clsx } from "clsx"
import {
  SquaresPlus,
  ShoppingBag,
  DocumentText,
  Users,
  ChartBar,
  CogSixTooth,
} from "@medusajs/icons"

interface ManageSidebarProps {
  locale?: string
  onNavigate?: () => void
}

const navSections = [
  {
    label: "Main",
    items: [
      { key: "dashboard", path: "", Icon: SquaresPlus },
      { key: "products", path: "/products", Icon: ShoppingBag },
      { key: "orders", path: "/orders", Icon: DocumentText },
    ],
  },
  {
    label: "Administration",
    items: [
      { key: "team", path: "/team", Icon: Users },
      { key: "analytics", path: "/analytics", Icon: ChartBar },
      { key: "settings", path: "/settings", Icon: CogSixTooth },
    ],
  },
]

export function ManageSidebar({ locale: localeProp, onNavigate }: ManageSidebarProps) {
  const { locale: ctxLocale, tenantSlug } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const location = useLocation()
  const baseHref = `/${tenantSlug}/${locale}/manage`

  const isActive = (path: string) => {
    const fullPath = `${baseHref}${path}`
    if (path === "") {
      return location.pathname === baseHref || location.pathname === `${baseHref}/`
    }
    return location.pathname.startsWith(fullPath)
  }

  return (
    <nav className="flex flex-col gap-4">
      {navSections.map((section) => (
        <div key={section.label}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ds-muted">
            {section.label}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.key}
                  to={`${baseHref}${item.path}` as any}
                  onClick={onNavigate}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-ds-primary/10 text-ds-primary"
                      : "text-ds-muted hover:bg-ds-accent hover:text-ds-foreground"
                  )}
                >
                  <item.Icon className="w-5 h-5" />
                  {t(locale, `manage.${item.key}`)}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
      <div className="mt-auto pt-4">
        <p className="px-3 text-[10px] text-ds-muted/60">v1.0.0</p>
      </div>
    </nav>
  )
}
