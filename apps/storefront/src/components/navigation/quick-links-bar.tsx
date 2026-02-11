import { useRef } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface QuickLink {
  id: string
  label: string
  href: string
  icon?: React.ReactNode
}

interface QuickLinksBarProps {
  locale?: string
  links: QuickLink[]
  onNavigate?: (href: string) => void
}

export function QuickLinksBar({ locale: localeProp, links, onNavigate }: QuickLinksBarProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "start" | "end") => {
    if (scrollRef.current) {
      const amount = direction === "end" ? 200 : -200
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  if (links.length === 0) return null

  return (
    <div className="relative bg-ds-accent/30 border-b border-ds-border">
      <div className="flex items-center max-w-7xl mx-auto">
        <button
          onClick={() => scroll("start")}
          className="flex-shrink-0 p-2 text-ds-muted hover:text-ds-text transition-colors"
          aria-label={t(locale, "blocks.previous_slide")}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide py-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ds-muted hover:text-ds-text bg-ds-card hover:bg-ds-accent border border-ds-border rounded-full transition-colors whitespace-nowrap"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate(link.href)
                }
              }}
            >
              {link.icon && <span className="w-3.5 h-3.5">{link.icon}</span>}
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => scroll("end")}
          className="flex-shrink-0 p-2 text-ds-muted hover:text-ds-text transition-colors"
          aria-label={t(locale, "blocks.next_slide")}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
