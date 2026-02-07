import { useState, useRef, useEffect } from "react"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { clsx as clx } from "clsx"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  onSubmit?: () => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search products...",
  autoFocus = false,
  className,
  onSubmit,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className={clx("relative", className)}>
      <div className="relative">
        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ui-fg-muted" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-12 bg-ui-bg-field border border-ui-border-base rounded-lg text-ui-fg-base placeholder:text-ui-fg-muted focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive focus:border-transparent"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-ui-bg-base-hover rounded"
          >
            <XMark className="w-4 h-4 text-ui-fg-muted" />
          </button>
        )}
      </div>
    </form>
  )
}
