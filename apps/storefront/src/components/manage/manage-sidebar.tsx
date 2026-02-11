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
    <nav className="flex flex-col gap-6 h-full">
      {navSections.map((section) => (
        <div key={section.label} className="flex flex-col gap-1.5">
          <p className="px-2 text-xs font-normal text-ds-muted">
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
                    "flex items-center gap-2 px-2 py-2 rounded text-sm font-normal transition-colors relative group",
                    active
                      ? "text-ds-primary font-medium"
                      : "text-ds-muted hover:text-ds-text hover:bg-ds-background"
                  )}
                >
                  {active && (
                    <div className="absolute inset-y-0 start-0 w-1 bg-ds-primary rounded-e" />
                  )}
                  <item.Icon className="w-4 h-4 flex-shrink-0" />
                  {t(locale, `manage.${item.key}`)}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
