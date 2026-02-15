import React, { useState, useEffect, useRef } from "react"
import { NotificationPanel } from "./notification-panel"

const NOTIFICATIONS_KEY = "dakkah_notifications"

export interface StorefrontNotification {
  id: string
  type: "order" | "promotion" | "system"
  title: string
  message: string
  read: boolean
  createdAt: number
}

function getNotifications(): StorefrontNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<StorefrontNotification[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNotifications(getNotifications())
    const handler = () => setNotifications(getNotifications())
    window.addEventListener("notifications-updated", handler)
    return () => window.removeEventListener("notifications-updated", handler)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold bg-ds-destructive text-white rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
