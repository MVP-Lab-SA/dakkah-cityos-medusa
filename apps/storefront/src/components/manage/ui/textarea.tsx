import { type TextareaHTMLAttributes, forwardRef } from "react"
import { clsx } from "clsx"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ error, className, rows = 4, ...props }, ref) {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          className={clsx(
            "w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors resize-vertical",
            "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:shadow-sm",
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-200 focus:ring-violet-500",
            props.disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
