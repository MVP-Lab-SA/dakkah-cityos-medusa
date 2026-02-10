import React from "react"

const variants = {
  default: "bg-ds-primary text-ds-primary-foreground",
  secondary: "bg-ds-secondary text-ds-secondary-foreground",
  success: "bg-ds-success text-ds-success-foreground",
  warning: "bg-ds-warning text-ds-warning-foreground",
  destructive: "bg-ds-destructive text-ds-destructive-foreground",
  outline: "border border-ds-border text-ds-foreground bg-transparent",
  muted: "bg-ds-muted text-ds-muted-foreground",
}

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
}

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
  removable?: boolean
  onRemove?: () => void
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  removable,
  onRemove,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ms-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-ds-foreground/10 transition-colors"
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
