import React, { useState } from "react"
import type { StorefrontNotification } from "./notification-bell"

const NOTIFICATIONS_KEY = "dakkah_notifications"
const MAX_NOTIFICATIONS = 50

type FilterTab = "all" | "order" | "promotion" | "system"

interface NotificationPanelProps {
  notifications: StorefrontNotification[]
  onClose: () => void
}

function saveNotifications(items: StorefrontNotification[]) {
  const pruned = items.slice(0, MAX_NOTIFICATIONS)
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(pruned))
  window.dispatchEvent(new CustomEvent("notifications-updated", { detail: pruned }))
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

const typeIcons: Record<StorefrontNotification["type"], React.ReactNode> = {
  order: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  promotion: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  system: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "order", label: "Orders" },
  { key: "promotion", label: "Promotions" },
  { key: "system", label: "System" },
]

export function NotificationPanel({
  notifications,
  onClose,
}: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all")

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab)

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    saveNotifications(updated)
  }

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    saveNotifications(updated)
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-ds-card border border-ds-border rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ds-border">
        <h3 className="text-sm font-semibold text-ds-foreground">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-ds-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex border-b border-ds-border">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "text-ds-primary border-b-2 border-ds-primary"
                : "text-ds-muted-foreground hover:text-ds-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="w-10 h-10 mx-auto text-ds-muted-foreground/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm text-ds-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-ds-border">
            {filtered.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-ds-muted/50 transition-colors ${
                  !notification.read ? "bg-ds-primary/5" : ""
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
                    notification.type === "order"
                      ? "bg-ds-info/15 text-ds-info"
                      : notification.type === "promotion"
                      ? "bg-ds-success/15 text-ds-success"
                      : "bg-ds-muted text-ds-muted-foreground"
                  }`}
                >
                  {typeIcons[notification.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${!notification.read ? "font-semibold text-ds-foreground" : "text-ds-foreground"}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-ds-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-ds-muted-foreground mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-ds-muted-foreground mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
