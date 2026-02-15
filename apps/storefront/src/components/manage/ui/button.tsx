import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react"
import { clsx } from "clsx"
import { Spinner } from "@medusajs/icons"

type ButtonVariant = "primary" | "secondary" | "transparent" | "danger"
type ButtonSize = "small" | "base" | "large"

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-ds-primary text-white hover:bg-ds-primary/90 focus:ring-ds-primary",
  secondary: "bg-ds-card text-ds-foreground/80 border border-ds-border hover:bg-ds-muted/50 focus:ring-ds-primary",
  transparent: "bg-transparent text-ds-foreground/80 hover:bg-ds-muted focus:ring-ds-primary",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
}

const sizeStyles: Record<ButtonSize, string> = {
  small: "px-2.5 py-1.5 text-xs gap-1",
  base: "px-3 py-2 text-sm gap-1.5",
  large: "px-4 py-2.5 text-sm gap-2",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "secondary",
      size = "base",
      isLoading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",
          variantStyles[variant],
          sizeStyles[size],
          (disabled || isLoading) && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading && (
          <Spinner className="w-4 h-4 animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
