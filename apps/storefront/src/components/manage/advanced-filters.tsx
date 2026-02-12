import React, { useState, useCallback } from 'react'

export interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'boolean'
  options?: { value: string; label: string }[]
}

interface AdvancedFiltersProps {
  fields: FilterField[]
  onApply: (filters: Record<string, any>) => void
  onClear: () => void
  activeFilterCount: number
}

export function AdvancedFilters({ fields, onApply, onClear, activeFilterCount }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState<Record<string, any>>({})
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({})

  const setValue = useCallback((key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleApply = () => {
    const nonEmpty: Record<string, any> = {}
    for (const [k, v] of Object.entries(values)) {
      if (v !== '' && v !== undefined && v !== null) {
        if (typeof v === 'object' && v.from === '' && v.to === '') continue
        if (typeof v === 'object' && v.min === '' && v.max === '') continue
        nonEmpty[k] = v
      }
    }
    setAppliedFilters(nonEmpty)
    onApply(nonEmpty)
  }

  const handleClear = () => {
    setValues({})
    setAppliedFilters({})
    onClear()
  }

  const removeFilter = (key: string) => {
    const next = { ...values }
    delete next[key]
    setValues(next)
    const nextApplied = { ...appliedFilters }
    delete nextApplied[key]
    setAppliedFilters(nextApplied)
    onApply(nextApplied)
  }

  const getFilterLabel = (key: string): string => {
    const field = fields.find((f) => f.key === key)
    return field?.label || key
  }

  const getFilterDisplayValue = (key: string, value: any): string => {
    const field = fields.find((f) => f.key === key)
    if (!field) return String(value)

    if (field.type === 'select' && field.options) {
      const opt = field.options.find((o) => o.value === value)
      return opt?.label || String(value)
    }
    if (field.type === 'boolean') return value ? 'Yes' : 'No'
    if (field.type === 'dateRange' && typeof value === 'object') {
      return `${value.from || '...'} – ${value.to || '...'}`
    }
    if (field.type === 'number' && typeof value === 'object') {
      return `${value.min || '...'} – ${value.max || '...'}`
    }
    return String(value)
  }

  const appliedKeys = Object.keys(appliedFilters)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-md hover:bg-ds-muted/80 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-ds-primary text-ds-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {appliedKeys.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {appliedKeys.map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-ds-primary/10 text-ds-primary rounded-full"
              >
                {getFilterLabel(key)}: {getFilterDisplayValue(key, appliedFilters[key])}
                <button
                  type="button"
                  onClick={() => removeFilter(key)}
                  className="hover:text-ds-destructive transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-ds-muted-foreground hover:text-ds-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="bg-ds-card border border-ds-border rounded-lg p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="block text-xs font-medium text-ds-muted-foreground">
                  {field.label}
                </label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={values[field.key] || ''}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    placeholder={`Filter by ${field.label.toLowerCase()}`}
                    className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                  />
                )}
                {field.type === 'select' && (
                  <select
                    value={values[field.key] || ''}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                  >
                    <option value="">All</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === 'date' && (
                  <input
                    type="date"
                    value={values[field.key] || ''}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                  />
                )}
                {field.type === 'dateRange' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={values[field.key]?.from || ''}
                      onChange={(e) =>
                        setValue(field.key, { ...(values[field.key] || {}), from: e.target.value })
                      }
                      className="flex-1 px-2 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                    />
                    <span className="text-xs text-ds-muted-foreground">to</span>
                    <input
                      type="date"
                      value={values[field.key]?.to || ''}
                      onChange={(e) =>
                        setValue(field.key, { ...(values[field.key] || {}), to: e.target.value })
                      }
                      className="flex-1 px-2 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                    />
                  </div>
                )}
                {field.type === 'number' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={values[field.key]?.min ?? ''}
                      onChange={(e) =>
                        setValue(field.key, { ...(values[field.key] || {}), min: e.target.value })
                      }
                      placeholder="Min"
                      className="flex-1 px-2 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                    />
                    <span className="text-xs text-ds-muted-foreground">–</span>
                    <input
                      type="number"
                      value={values[field.key]?.max ?? ''}
                      onChange={(e) =>
                        setValue(field.key, { ...(values[field.key] || {}), max: e.target.value })
                      }
                      placeholder="Max"
                      className="flex-1 px-2 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                    />
                  </div>
                )}
                {field.type === 'boolean' && (
                  <select
                    value={values[field.key] === undefined ? '' : String(values[field.key])}
                    onChange={(e) => {
                      const v = e.target.value
                      setValue(field.key, v === '' ? undefined : v === 'true')
                    }}
                    className="w-full px-3 py-2 text-sm bg-ds-background border border-ds-border rounded-md text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-ds-border">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-sm font-medium text-ds-muted-foreground hover:text-ds-foreground transition-colors"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-md hover:opacity-90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
