import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface PaginationProps {
  locale?: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function getPageNumbers(current: number, total: number, siblings: number): (number | "...")[] {
  const pages: (number | "...")[] = []
  const left = Math.max(2, current - siblings)
  const right = Math.min(total - 1, current + siblings)

  pages.push(1)
  if (left > 2) pages.push("...")
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push("...")
  if (total > 1) pages.push(total)

  return pages
}

export function Pagination({
  locale: localeProp,
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages, siblingCount)

  return (
    <nav className="flex items-center justify-center gap-1" aria-label={t(locale, "navigation.pagination")}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-ds-muted hover:text-ds-text bg-ds-card border border-ds-border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t(locale, "navigation.previous")}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">{t(locale, "navigation.previous")}</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-2 py-2 text-sm text-ds-muted">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                page === currentPage
                  ? "bg-ds-primary text-ds-primary-foreground"
                  : "text-ds-muted hover:text-ds-text bg-ds-card border border-ds-border hover:bg-ds-accent"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`${t(locale, "navigation.page")} ${page}`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-ds-muted hover:text-ds-text bg-ds-card border border-ds-border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t(locale, "navigation.next")}
      >
        <span className="hidden sm:inline">{t(locale, "navigation.next")}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}
