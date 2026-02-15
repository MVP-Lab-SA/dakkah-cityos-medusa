import { type ReactNode, useEffect } from "react"
import { clsx } from "clsx"
import { XMark } from "@medusajs/icons"

interface FocusModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function FocusModal({ open, onClose, title, children, className }: FocusModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        className={clsx(
          "relative bg-ds-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-[fadeInScale_0.15s_ease-out]",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ds-border">
          {title && (
            <h2 className="text-base font-semibold text-ds-foreground">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="text-ds-muted-foreground/70 hover:text-ds-muted-foreground transition-colors rounded-md p-1 ms-auto -me-1"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
