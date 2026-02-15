import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react"
import { clsx } from "clsx"

type IconButtonVariant = "default" | "transparent"
type IconButtonSize = "small" | "base" | "large"

const variantStyles: Record<IconButtonVariant, string> = {
  default: "bg-ds-card text-ds-muted-foreground border border-ds-border hover:bg-ds-muted/50 hover:text-ds-foreground",
  transparent: "bg-transparent text-ds-muted-foreground hover:bg-ds-muted hover:text-ds-foreground",
}

const sizeStyles: Record<IconButtonSize, string> = {
  small: "w-7 h-7",
  base: "w-8 h-8",
  large: "w-10 h-10",
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { variant = "default", size = "base", disabled, children, className, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ds-primary focus:ring-offset-1",
          variantStyles[variant],
          sizeStyles[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
