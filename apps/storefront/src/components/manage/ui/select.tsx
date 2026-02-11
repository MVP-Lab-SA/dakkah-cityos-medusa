import { type SelectHTMLAttributes, forwardRef } from "react"
import { clsx } from "clsx"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[]
  placeholder?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ options, placeholder, error, className, ...props }, ref) {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={clsx(
            "w-full rounded-md border bg-white px-3 py-2 pe-8 text-sm text-gray-900 transition-colors appearance-none",
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[position:right_0.5rem_center] bg-no-repeat",
            "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:shadow-sm",
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-200 focus:ring-violet-500",
            props.disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }
)
