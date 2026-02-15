import { useState, useRef, useEffect, type ReactNode } from "react"
import { clsx } from "clsx"
import { EllipsisHorizontal } from "@medusajs/icons"

interface DropdownMenuItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  variant?: "default" | "danger"
  disabled?: boolean
}

interface DropdownMenuSeparator {
  type: "separator"
}

type DropdownMenuEntry = DropdownMenuItem | DropdownMenuSeparator

function isSeparator(entry: DropdownMenuEntry): entry is DropdownMenuSeparator {
  return "type" in entry && entry.type === "separator"
}

interface DropdownMenuProps {
  items: DropdownMenuEntry[]
  trigger?: ReactNode
  align?: "start" | "end"
  className?: string
}

export function DropdownMenu({ items, trigger, align = "end", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className={clsx("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
      >
        {trigger || <EllipsisHorizontal className="w-5 h-5" />}
      </button>

      {open && (
        <div
          className={clsx(
            "absolute z-50 mt-1 min-w-[160px] bg-ds-card border border-ds-border rounded-lg shadow-lg py-1",
            align === "end" ? "end-0" : "start-0"
          )}
        >
          {items.map((entry, i) => {
            if (isSeparator(entry)) {
              return <div key={i} className="my-1 border-t border-ds-border" />
            }

            return (
              <button
                key={i}
                type="button"
                disabled={entry.disabled}
                onClick={() => {
                  entry.onClick()
                  setOpen(false)
                }}
                className={clsx(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-start transition-colors",
                  entry.variant === "danger"
                    ? "text-ds-destructive hover:bg-ds-destructive/10"
                    : "text-ds-foreground/80 hover:bg-ds-muted/50",
                  entry.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {entry.icon && <span className="w-4 h-4 flex-shrink-0">{entry.icon}</span>}
                {entry.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
