import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { XMark } from "@medusajs/icons"
import { SearchInput } from "./search-input"
import { SearchSuggestions } from "./search-suggestions"
import { useSearchSuggestions } from "@/lib/hooks/use-search"
import { useTenantPrefix } from "@/lib/context/tenant-context"

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const tenantPrefix = useTenantPrefix()
  const { data: suggestions = [] } = useSearchSuggestions(query)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  const handleSubmit = () => {
    if (query.length >= 2) {
      window.location.href = `${tenantPrefix}/search?q=${encodeURIComponent(query)}`
      onClose()
      setQuery("")
    }
  }

  const handleSelect = () => {
    onClose()
    setQuery("")
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-ui-bg-base rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-ui-border-base">
            <h2 className="text-lg font-medium text-ui-fg-base">Search</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-ui-bg-base-hover rounded-lg transition-colors"
            >
              <XMark className="w-5 h-5 text-ui-fg-muted" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 relative">
            <SearchInput
              value={query}
              onChange={setQuery}
              autoFocus
              onSubmit={handleSubmit}
              placeholder="Search for products..."
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                tenantPrefix={tenantPrefix}
                onSelect={handleSelect}
              />
            )}
          </div>

          {/* Quick Links */}
          <div className="p-4 border-t border-ui-border-base bg-ui-bg-subtle">
            <p className="text-xs text-ui-fg-muted mb-2">Quick links</p>
            <div className="flex flex-wrap gap-2">
              {["New Arrivals", "Best Sellers", "On Sale"].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    setQuery(link)
                    handleSubmit()
                  }}
                  className="px-3 py-1 text-sm bg-ui-bg-base border border-ui-border-base rounded-full hover:bg-ui-bg-base-hover transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-xs text-ui-fg-muted mt-4">
          Press <kbd className="px-1.5 py-0.5 bg-ui-bg-base rounded text-ui-fg-subtle">ESC</kbd> to close
        </p>
      </div>
    </div>
  )
}
