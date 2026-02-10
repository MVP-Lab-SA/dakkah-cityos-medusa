import React from "react"

interface TextareaProps {
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  rows?: number
  maxLength?: number
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: () => void
  onBlur?: () => void
}

export const Textarea: React.FC<TextareaProps> = ({
  name,
  value,
  defaultValue,
  placeholder,
  disabled,
  readOnly,
  rows = 4,
  maxLength,
  label,
  error,
  helperText,
  required,
  className = "",
  onChange,
  onFocus,
  onBlur,
}) => {
  const currentLength = typeof value === "string" ? value.length : 0

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-ds-foreground mb-1.5">
          {label}
          {required && <span className="text-ds-destructive ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        maxLength={maxLength}
        required={required}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y ${error ? "border-ds-destructive" : "border-ds-border bg-ds-background text-ds-foreground"}`}
      />
      <div className="flex justify-between mt-1">
        {(error || helperText) && (
          <p className={`text-xs ${error ? "text-ds-destructive" : "text-ds-muted-foreground"}`}>
            {error || helperText}
          </p>
        )}
        {maxLength && (
          <p className="text-xs text-ds-muted-foreground ml-auto">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
