import { type InputHTMLAttributes, forwardRef } from "react"
import { clsx } from "clsx"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ error, className, ...props }, ref) {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={clsx(
            "w-full rounded-md border bg-ds-card px-3 py-2 text-sm text-ds-foreground placeholder:text-ds-muted-foreground/70 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:shadow-sm",
            error
              ? "border-ds-destructive/50 focus:ring-red-500"
              : "border-ds-border focus:ring-ds-primary",
            props.disabled && "bg-ds-muted/50 text-ds-muted-foreground/70 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-ds-destructive">{error}</p>
        )}
      </div>
    )
  }
)
