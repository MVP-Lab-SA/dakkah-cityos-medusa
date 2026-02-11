import { useState, useEffect, useRef } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read?: boolean
  icon?: "order" | "promo" | "info" | "success"
  href?: string
}

interface NotificationBellProps {
  locale?: string
  className?: string
  notifications?: Notification[]
  onNotificationClick?: (id: string) => void
  onMarkAllRead?: () => void
}

export function NotificationBell({
  locale: localeProp,
  className = "",
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
}: NotificationBellProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (typeof window === "undefined") return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const iconMap: Record<string, React.ReactNode> = {
    order: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    promo: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-ds-muted hover:text-ds-text transition-colors rounded-md hover:bg-ds-accent"
        aria-label={t(locale, "interactive.notifications")}
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0.5 end-0.5 flex items-center justify-center min-w-[1rem] h-4 px-1 text-[10px] font-bold bg-ds-destructive text-white rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-80 bg-ds-card border border-ds-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ds-border">
            <h3 className="text-sm font-semibold text-ds-text">
              {t(locale, "interactive.notifications")}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => { onMarkAllRead?.(); }}
                className="text-xs text-ds-primary hover:underline"
              >
                {t(locale, "interactive.mark_all_read")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-ds-border">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-ds-muted text-center">
                {t(locale, "interactive.no_notifications")}
              </p>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => { onNotificationClick?.(notif.id); }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-ds-accent ${
                    !notif.read ? "bg-ds-primary/5" : ""
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    !notif.read ? "bg-ds-primary/10 text-ds-primary" : "bg-ds-accent text-ds-muted"
                  }`}>
                    {iconMap[notif.icon || "info"]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!notif.read ? "font-medium text-ds-text" : "text-ds-muted"}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-ds-muted line-clamp-2 mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-ds-muted mt-1">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-ds-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
