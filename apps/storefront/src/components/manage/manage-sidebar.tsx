import { Link, useLocation } from "@tanstack/react-router"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { clsx } from "clsx"
import { useState } from "react"
import {
  SquaresPlus,
  ShoppingBag,
  DocumentText,
  Users,
  ChartBar,
  CogSixTooth,
  Tag,
  Cash,
  ArrowPath,
  Star,
  BuildingStorefront,
  Channels,
  ShieldCheck,
  AcademicCap,
  Calendar,
  ArrowUpDown,
  Bolt,
  Book,
  Beaker,
  ChefHat,
  Sparkles,
  Target,
  ChatBubble,
  Trophy,
  Buildings,
  ServerStack,
  Swatch,
  TruckFast,
  Heart,
  RocketLaunch,
  Bookmarks,
  ChevronDownMini,
} from "@medusajs/icons"
import {
  type ModuleDefinition,
  type NavSection,
  NAV_SECTION_ORDER,
  NAV_SECTION_LABELS,
  getModulesBySection,
} from "./module-registry"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  SquaresPlus,
  ShoppingBag,
  DocumentText,
  Users,
  ChartBar,
  CogSixTooth,
  Tag,
  Cash,
  ArrowPath,
  Star,
  BuildingStorefront,
  Channels,
  ShieldCheck,
  AcademicCap,
  Calendar,
  ArrowUpDown,
  Bolt,
  Book,
  Beaker,
  ChefHat,
  Sparkles,
  Target,
  ChatBubble,
  Trophy,
  Buildings,
  ServerStack,
  Swatch,
  TruckFast,
  Heart,
  RocketLaunch,
  Bookmarks,
}

interface ManageSidebarProps {
  locale?: string
  onNavigate?: () => void
}

function SidebarSection({
  section,
  modules,
  baseHref,
  locale,
  isActive,
  onNavigate,
}: {
  section: NavSection
  modules: ModuleDefinition[]
  baseHref: string
  locale: string
  isActive: (path: string) => boolean
  onNavigate?: () => void
}) {
  const hasActiveChild = modules.some((m) => isActive(m.path))
  const [open, setOpen] = useState(section === "overview" || hasActiveChild)

  if (modules.length === 0) return null

  if (section === "overview") {
    return (
      <div className="flex flex-col gap-0.5">
        {modules.map((mod) => (
          <SidebarItem
            key={mod.key}
            mod={mod}
            baseHref={baseHref}
            locale={locale}
            active={isActive(mod.path)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-2 py-1 text-xs font-normal text-ds-muted hover:text-ds-text transition-colors"
      >
        <span>{t(locale, `manage.${section}`)}</span>
        <ChevronDownMini
          className={clsx(
            "w-3 h-3 transition-transform duration-150",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5">
          {modules.map((mod) => (
            <SidebarItem
              key={mod.key}
              mod={mod}
              baseHref={baseHref}
              locale={locale}
              active={isActive(mod.path)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarItem({
  mod,
  baseHref,
  locale,
  active,
  onNavigate,
}: {
  mod: ModuleDefinition
  baseHref: string
  locale: string
  active: boolean
  onNavigate?: () => void
}) {
  const IconComponent = ICON_MAP[mod.icon] || SquaresPlus

  return (
    <Link
      to={`${baseHref}${mod.path}` as any}
      onClick={onNavigate}
      className={clsx(
        "flex items-center gap-2 px-2 py-1.5 rounded text-sm font-normal transition-colors relative group",
        active
          ? "text-ds-primary font-medium"
          : "text-ds-muted hover:text-ds-text hover:bg-ds-background"
      )}
    >
      {active && (
        <div className="absolute inset-y-0 start-0 w-1 bg-ds-primary rounded-e" />
      )}
      <IconComponent className="w-4 h-4 flex-shrink-0 ms-1" />
      {t(locale, `manage.${mod.key.replace(/-/g, "_")}`)}
    </Link>
  )
}

export function ManageSidebar({ locale: localeProp, onNavigate }: ManageSidebarProps) {
  const { locale: ctxLocale, tenantSlug } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const location = useLocation()
  const baseHref = `/${tenantSlug}/${locale}/manage`

  const userWeight = 100

  const sectionModules = getModulesBySection(userWeight)

  const isActive = (path: string) => {
    const fullPath = `${baseHref}${path}`
    if (path === "") {
      return location.pathname === baseHref || location.pathname === `${baseHref}/`
    }
    return location.pathname.startsWith(fullPath)
  }

  return (
    <nav className="flex flex-col gap-3 h-full overflow-y-auto">
      {NAV_SECTION_ORDER.map((section) => {
        const modules = sectionModules[section]
        if (!modules || modules.length === 0) return null
        return (
          <SidebarSection
            key={section}
            section={section}
            modules={modules}
            baseHref={baseHref}
            locale={locale}
            isActive={isActive}
            onNavigate={onNavigate}
          />
        )
      })}
    </nav>
  )
}
