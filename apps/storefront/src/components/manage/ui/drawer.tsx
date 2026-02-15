import { type ReactNode, useEffect } from "react"
import { clsx } from "clsx"
import { XMark } from "@medusajs/icons"

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Drawer({ open, onClose, title, description, children, footer, className }: DrawerProps) {
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
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div
        className={clsx(
          "absolute top-0 end-0 bottom-0 w-full max-w-lg bg-ds-card shadow-xl flex flex-col animate-[slideInRight_0.2s_ease-out]",
          className
        )}
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-ds-border">
          <div>
            <h2 className="text-base font-semibold text-ds-foreground">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-ds-muted-foreground">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ds-muted-foreground/70 hover:text-ds-muted-foreground transition-colors rounded-md p-1 -me-1 -mt-1"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="border-t border-ds-border px-6 py-4 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
