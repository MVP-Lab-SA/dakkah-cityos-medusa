import { Link, useLocation } from "@tanstack/react-router"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { clsx } from "clsx"
import { useState, useRef, useEffect } from "react"
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
  TruckFast,
  Heart,
  RocketLaunch,
  Bookmarks,
  ChevronDownMini,
  MagnifyingGlass,
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
  TruckFast,
  Heart,
  RocketLaunch,
  Bookmarks,
}

interface ManageSidebarProps {
  locale?: string
  onNavigate?: () => void
}

function CollapsibleContent({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(open ? undefined : 0)

  useEffect(() => {
    if (!ref.current) return
    if (open) {
      const h = ref.current.scrollHeight
      setHeight(h)
      const timer = setTimeout(() => setHeight(undefined), 150)
      return () => clearTimeout(timer)
    } else {
      setHeight(ref.current.scrollHeight)
      requestAnimationFrame(() => {
        setHeight(0)
      })
    }
  }, [open])

  return (
    <div
      ref={ref}
      style={{ height: height !== undefined ? height : "auto" }}
      className="overflow-hidden transition-[height] duration-150 ease-in-out"
    >
      {children}
    </div>
  )
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
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-400 hover:text-gray-500 transition-colors"
      >
        <span>{t(locale, `manage.${section}`)}</span>
        <ChevronDownMini
          className={clsx(
            "w-3 h-3 text-gray-300 transition-transform duration-150",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      <CollapsibleContent open={open}>
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
      </CollapsibleContent>
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
        "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-all duration-150 relative group",
        active
          ? "text-gray-900 font-medium bg-gray-50"
          : "text-gray-500 font-normal hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      {active && (
        <div className="absolute inset-y-1 start-0 w-0.5 bg-violet-600 rounded-e" />
      )}
      <IconComponent
        className={clsx(
          "w-4 h-4 flex-shrink-0",
          active ? "text-violet-600" : "text-gray-400"
        )}
      />
      <span className="truncate">{t(locale, `manage.${mod.key.replace(/-/g, "_")}`)}</span>
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
    <nav className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="px-1">
        <button
          type="button"
          className="flex items-center gap-2 w-full px-2 py-1.5 text-[13px] text-gray-400 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
        >
          <MagnifyingGlass className="w-3.5 h-3.5 text-gray-400" />
          <span className="flex-1 text-start">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded">
            ⌘K
          </kbd>
        </button>
      </div>
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
