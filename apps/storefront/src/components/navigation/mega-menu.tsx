import { useState, useRef, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface MegaMenuCategory {
  id: string
  label: string
  href: string
  subcategories?: { id: string; label: string; href: string }[]
  featured?: { id: string; label: string; href: string; image?: string; badge?: string }[]
}

interface MegaMenuProps {
  locale?: string
  categories: MegaMenuCategory[]
  onNavigate?: (href: string) => void
}

export function MegaMenu({ locale: localeProp, categories, onNavigate }: MegaMenuProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveCategory(null)
      }
    }
    if (typeof window !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent, categoryId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setActiveCategory(activeCategory === categoryId ? null : categoryId)
    } else if (e.key === "Escape") {
      setActiveCategory(null)
    }
  }

  const active = categories.find((c) => c.id === activeCategory)

  return (
    <nav ref={menuRef} className="relative" aria-label={t(locale, "megaMenu.navigation")}>
      <ul className="flex items-center gap-1" role="menubar">
        {categories.map((cat) => (
          <li key={cat.id} role="none">
            <button
              role="menuitem"
              aria-expanded={activeCategory === cat.id}
              aria-haspopup="true"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeCategory === cat.id
                  ? "bg-ds-accent text-ds-text"
                  : "text-ds-muted hover:text-ds-text hover:bg-ds-accent/50"
              }`}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              onKeyDown={(e) => handleKeyDown(e, cat.id)}
            >
              {cat.label}
              <svg className="inline-block w-3 h-3 ms-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          className="absolute start-0 top-full mt-1 w-full min-w-[600px] bg-ds-card border border-ds-border rounded-lg shadow-lg z-50 p-6"
          role="menu"
          onMouseLeave={() => setActiveCategory(null)}
        >
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-ds-text mb-3">{active.label}</h3>
              <div className="grid grid-cols-2 gap-2">
                {active.subcategories?.map((sub) => (
                  <a
                    key={sub.id}
                    href={sub.href}
                    role="menuitem"
                    className="block px-3 py-2 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-accent rounded-md transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigate?.(sub.href)
                      setActiveCategory(null)
                    }}
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            </div>

            {active.featured && active.featured.length > 0 && (
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-ds-text mb-3">
                  {t(locale, "blocks.featured")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {active.featured.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      role="menuitem"
                      className="group block rounded-lg overflow-hidden border border-ds-border hover:border-ds-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        onNavigate?.(item.href)
                        setActiveCategory(null)
                      }}
                    >
                      {item.image && (
                        <div className="aspect-video bg-ds-accent overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-2">
                        <span className="text-sm font-medium text-ds-text">{item.label}</span>
                        {item.badge && (
                          <span className="ms-2 text-xs bg-ds-primary/10 text-ds-primary px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
