"use client"

import { t } from "@/lib/i18n"
import { clsx } from "clsx"
import { useCallback, useEffect, useState } from "react"

export interface SocialProofEvent {
  customerName: string
  location: string
  product: string
  productImage?: string
  timestamp: string
}

export interface SocialProofPopupProps {
  events: SocialProofEvent[]
  duration?: number
  delay?: number
  interval?: number
  locale: string
}

export function SocialProofPopup({
  events,
  duration = 5000,
  delay = 3000,
  interval = 10000,
  locale,
}: SocialProofPopupProps) {
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showNext = useCallback(() => {
    if (events.length === 0 || dismissed) return
    setCurrentIndex((prev) => prev % events.length)
    setVisible(true)
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, duration)
    return () => clearTimeout(hideTimer)
  }, [events.length, duration, dismissed])

  useEffect(() => {
    if (!mounted || events.length === 0 || dismissed) return

    const initialTimer = setTimeout(() => {
      showNext()
    }, delay)

    const intervalTimer = setInterval(() => {
      if (!dismissed) showNext()
    }, interval + duration)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(intervalTimer)
    }
  }, [mounted, events.length, delay, interval, duration, dismissed, showNext])

  if (!mounted || events.length === 0 || dismissed) return null

  const event = events[currentIndex]
  if (!event) return null

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return t(locale, "socialProof.justNow")
    if (minutes < 60) return `${minutes}${t(locale, "socialProof.minutesAgo")}`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}${t(locale, "socialProof.hoursAgo")}`
    return `${Math.floor(hours / 24)}${t(locale, "socialProof.daysAgo")}`
  }

  return (
    <div
      className={clsx(
        "fixed bottom-4 start-4 z-40 max-w-sm transition-all duration-500 ease-in-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="bg-ds-background border border-ds-border rounded shadow-lg p-4 flex items-start gap-3">
        {event.productImage ? (
          <div className="w-12 h-12 flex-shrink-0 bg-ds-muted overflow-hidden rounded">
            <img
              src={event.productImage}
              alt={event.product}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex-shrink-0 bg-ds-muted rounded flex items-center justify-center">
            <svg className="w-6 h-6 text-ds-muted-foreground" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-ds-foreground">
            <span className="font-semibold">{event.customerName}</span>{" "}
            {t(locale, "socialProof.purchased")}{" "}
            <span className="font-semibold">{event.product}</span>
          </p>
          <p className="text-xs text-ds-muted-foreground mt-0.5">
            {event.location} &middot; {formatTimeAgo(event.timestamp)}
          </p>
        </div>

        <button
          onClick={() => {
            setVisible(false)
            setDismissed(true)
          }}
          className="flex-shrink-0 text-ds-muted-foreground hover:text-ds-foreground transition-colors"
          aria-label={t(locale, "socialProof.dismiss")}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
