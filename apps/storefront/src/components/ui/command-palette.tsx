"use client"

import { clsx } from "clsx"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

export interface CommandItem {
  id: string
  label: string
  category: string
  icon?: string
  href?: string
  onSelect?: () => void
}

export interface CommandPaletteProps {
  items: CommandItem[]
  open: boolean
  onClose: () => void
  onSelect: (item: CommandItem) => void
  placeholder?: string
}

function fuzzyMatch(query: string, text: string): boolean {
  const lowerQuery = query.toLowerCase()
  const lowerText = text.toLowerCase()
  let qi = 0
  for (let ti = 0; ti < lowerText.length && qi < lowerQuery.length; ti++) {
    if (lowerText[ti] === lowerQuery[qi]) qi++
  }
  return qi === lowerQuery.length
}

export function CommandPalette({
  items,
  open,
  onClose,
  onSelect,
  placeholder = "Search...",
}: CommandPaletteProps) {
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [open])

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    return items.filter((item) => fuzzyMatch(query, item.label) || fuzzyMatch(query, item.category))
  }, [items, query])

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category]!.push(item)
    }
    return groups
  }, [filtered])

  const flatItems = useMemo(() => filtered, [filtered])

  const handleSelect = useCallback(
    (item: CommandItem) => {
      onSelect(item)
      item.onSelect?.()
      onClose()
    },
    [onSelect, onClose]
  )

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((prev) => (prev + 1) % Math.max(flatItems.length, 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((prev) => (prev - 1 + flatItems.length) % Math.max(flatItems.length, 1))
          break
        case "Enter":
          e.preventDefault()
          if (flatItems[activeIndex]) handleSelect(flatItems[activeIndex])
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    },
    [flatItems, activeIndex, handleSelect, onClose]
  )

  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`)
    activeEl?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  if (!mounted || !open) return null

  let itemIndex = 0

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-ds-foreground/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg bg-ds-background border border-ds-border rounded shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center border-b border-ds-border px-4">
          <svg
            className="w-5 h-5 text-ds-muted-foreground flex-shrink-0 me-3"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 py-3 bg-transparent text-ds-foreground placeholder:text-ds-muted-foreground outline-none text-base"
            aria-label="Search commands"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-xs text-ds-muted-foreground bg-ds-muted px-2 py-1 rounded">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto py-2" role="listbox">
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-ds-muted-foreground">
              No results found
            </div>
          ) : (
            Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category}>
                <div className="px-4 py-1.5 text-xs font-semibold text-ds-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {categoryItems.map((item) => {
                  const currentIndex = itemIndex++
                  return (
                    <button
                      key={item.id}
                      data-index={currentIndex}
                      role="option"
                      aria-selected={currentIndex === activeIndex}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-start text-sm transition-colors",
                        currentIndex === activeIndex
                          ? "bg-ds-muted text-ds-foreground"
                          : "text-ds-muted-foreground hover:bg-ds-muted/50"
                      )}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                    >
                      {item.icon && (
                        <span className="text-base flex-shrink-0" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.href && (
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-ds-muted-foreground"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M6 4L10 8L6 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-ds-border px-4 py-2 flex items-center gap-4 text-xs text-ds-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <kbd className="bg-ds-muted px-1.5 py-0.5 rounded">↑↓</kbd> navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="bg-ds-muted px-1.5 py-0.5 rounded">↵</kbd> select
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="bg-ds-muted px-1.5 py-0.5 rounded">esc</kbd> close
          </span>
        </div>
      </div>
    </div>,
    document.body
  )
}
