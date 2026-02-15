import { useState, type ReactNode, type ReactElement } from "react"
import { clsx } from "clsx"

interface TooltipProps {
  content: string
  side?: "top" | "bottom"
  children: ReactElement
  className?: string
}

export function Tooltip({ content, side = "top", children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={clsx(
            "absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-ds-foreground rounded-md whitespace-nowrap pointer-events-none",
            "start-1/2 -translate-x-1/2",
            side === "top" && "bottom-full mb-2",
            side === "bottom" && "top-full mt-2",
            className
          )}
        >
          {content}
          <div
            className={clsx(
              "absolute start-1/2 -translate-x-1/2 w-2 h-2 bg-ds-foreground rotate-45",
              side === "top" && "top-full -mt-1",
              side === "bottom" && "bottom-full -mb-1"
            )}
          />
        </div>
      )}
    </div>
  )
}
