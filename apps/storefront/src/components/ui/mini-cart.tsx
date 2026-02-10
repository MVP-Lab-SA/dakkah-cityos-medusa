"use client"

import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

export interface MiniCartItem {
  id: string
  title: string
  thumbnail?: string
  quantity: number
  price: { amount: number; currencyCode: string }
  variantTitle?: string
}

export interface MiniCartProps {
  items: MiniCartItem[]
  subtotal: { amount: number; currencyCode: string }
  open: boolean
  onClose: () => void
  onCheckout: () => void
  onViewCart: () => void
  locale: string
}

export function MiniCart({
  items,
  subtotal,
  open,
  onClose,
  onCheckout,
  onViewCart,
  locale,
}: MiniCartProps) {
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onClose])

  if (!mounted) return null

  const formatPrice = (amount: number, currencyCode: string) =>
    formatCurrency(amount / 100, currencyCode, locale as SupportedLocale)

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-50 transition-opacity duration-300",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-ds-foreground/50"
        onClick={onClose}
        aria-label={t(locale, "miniCart.closeOverlay")}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, "miniCart.title")}
        className={clsx(
          "absolute inset-y-0 end-0 w-full sm:max-w-[420px] bg-ds-background border-s border-ds-border shadow-lg flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-ds-border">
          <h2 className="text-lg font-semibold text-ds-foreground">
            {t(locale, "miniCart.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-ds-muted-foreground hover:text-ds-foreground transition-colors"
            aria-label={t(locale, "miniCart.close")}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-base font-medium text-ds-muted-foreground">
              {t(locale, "miniCart.empty")}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                {item.thumbnail ? (
                  <div className="w-16 h-16 flex-shrink-0 bg-ds-muted overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 bg-ds-muted" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-ds-foreground line-clamp-1">
                    {item.title}
                  </h4>
                  {item.variantTitle && (
                    <p className="text-xs text-ds-muted-foreground mt-0.5">
                      {item.variantTitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-ds-muted-foreground">
                      {t(locale, "miniCart.qty")}: {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-ds-foreground">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="p-6 border-t border-ds-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-ds-muted-foreground">
                {t(locale, "miniCart.subtotal")}
              </span>
              <span className="text-base font-semibold text-ds-foreground">
                {formatPrice(subtotal.amount, subtotal.currencyCode)}
              </span>
            </div>
            <button
              onClick={onViewCart}
              className="w-full py-2.5 px-4 text-sm font-medium border border-ds-border bg-ds-background text-ds-foreground hover:bg-ds-muted transition-colors"
            >
              {t(locale, "miniCart.viewCart")}
            </button>
            <button
              onClick={onCheckout}
              className="w-full py-2.5 px-4 text-sm font-medium bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity"
            >
              {t(locale, "miniCart.checkout")}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
