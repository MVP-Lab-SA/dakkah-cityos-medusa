import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface DrawerCategory {
  id: string
  label: string
  href: string
  children?: { id: string; label: string; href: string }[]
}

interface MobileDrawerProps {
  locale?: string
  isOpen: boolean
  onClose: () => void
  categories: DrawerCategory[]
  onNavigate?: (href: string) => void
}

export function MobileDrawer({ locale: localeProp, isOpen, onClose, categories, onNavigate }: MobileDrawerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (typeof window !== "undefined" && isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />
      <aside
        className="fixed inset-y-0 start-0 w-80 max-w-[85vw] bg-ds-card z-50 shadow-xl flex flex-col transform transition-transform"
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, "megaMenu.navigation")}
      >
        <div className="flex items-center justify-between p-4 border-b border-ds-border">
          <h2 className="text-lg font-semibold text-ds-text">{t(locale, "megaMenu.menu")}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-ds-accent text-ds-muted hover:text-ds-text transition-colors"
            aria-label={t(locale, "common.close")}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul role="menu">
            {categories.map((cat) => (
              <li key={cat.id} role="none">
                {cat.children && cat.children.length > 0 ? (
                  <>
                    <button
                      role="menuitem"
                      aria-expanded={expanded.has(cat.id)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-ds-text hover:bg-ds-accent rounded-md transition-colors"
                      onClick={() => toggle(cat.id)}
                    >
                      <span>{cat.label}</span>
                      <svg
                        className={`w-4 h-4 text-ds-muted transition-transform ${
                          expanded.has(cat.id) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expanded.has(cat.id) && (
                      <ul className="ps-4 pb-2" role="menu">
                        <li role="none">
                          <a
                            href={cat.href}
                            role="menuitem"
                            className="block px-3 py-2 text-sm text-ds-primary hover:bg-ds-accent rounded-md transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              onNavigate?.(cat.href)
                              onClose()
                            }}
                          >
                            {t(locale, "common.view_all")}
                          </a>
                        </li>
                        {cat.children.map((child) => (
                          <li key={child.id} role="none">
                            <a
                              href={child.href}
                              role="menuitem"
                              className="block px-3 py-2 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-accent rounded-md transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                onNavigate?.(child.href)
                                onClose()
                              }}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={cat.href}
                    role="menuitem"
                    className="block px-3 py-3 text-sm font-medium text-ds-text hover:bg-ds-accent rounded-md transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigate?.(cat.href)
                      onClose()
                    }}
                  >
                    {cat.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
