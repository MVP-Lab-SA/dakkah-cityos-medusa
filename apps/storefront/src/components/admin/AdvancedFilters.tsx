// @ts-nocheck
import { useState } from "react"

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  type: "select" | "date-range" | "search" | "checkbox"
  options?: FilterOption[]
}

interface AdvancedFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onReset: () => void
}

export function AdvancedFilters({
  filters,
  values,
  onChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeFilterCount = Object.values(values).filter(
    (v) => v !== undefined && v !== "" && v !== null && !(Array.isArray(v) && v.length === 0)
  ).length

  return (
    <div className="rounded-xl border border-ds-border-primary bg-ds-bg-primary">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-ds-bg-secondary"
      >
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-ds-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium text-ds-text-primary">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-ds-bg-accent px-2 py-0.5 text-xs font-medium text-ds-text-accent">
              {activeFilterCount}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-ds-text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-ds-border-primary px-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="mb-1.5 block text-xs font-medium text-ds-text-secondary">
                  {filter.label}
                </label>

                {filter.type === "select" && (
                  <select
                    value={values[filter.key] || ""}
                    onChange={(e) => onChange(filter.key, e.target.value)}
                    className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-3 py-2 text-sm text-ds-text-primary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                  >
                    <option value="">All</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === "search" && (
                  <div className="relative">
                    <svg
                      className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ds-text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={values[filter.key] || ""}
                      onChange={(e) => onChange(filter.key, e.target.value)}
                      placeholder={`Search ${filter.label.toLowerCase()}...`}
                      className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary py-2 ps-9 pe-3 text-sm text-ds-text-primary placeholder:text-ds-text-secondary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                    />
                  </div>
                )}

                {filter.type === "date-range" && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={values[filter.key]?.from || ""}
                      onChange={(e) =>
                        onChange(filter.key, {
                          ...values[filter.key],
                          from: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-3 py-2 text-sm text-ds-text-primary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                    />
                    <input
                      type="date"
                      value={values[filter.key]?.to || ""}
                      onChange={(e) =>
                        onChange(filter.key, {
                          ...values[filter.key],
                          to: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-ds-border-primary bg-ds-bg-primary px-3 py-2 text-sm text-ds-text-primary focus:border-ds-border-accent focus:outline-none focus:ring-1 focus:ring-ds-border-accent"
                    />
                  </div>
                )}

                {filter.type === "checkbox" && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {filter.options?.map((opt) => {
                      const checked = Array.isArray(values[filter.key])
                        ? values[filter.key].includes(opt.value)
                        : false
                      return (
                        <label
                          key={opt.value}
                          className="flex items-center gap-2 cursor-pointer text-sm text-ds-text-primary hover:text-ds-text-accent"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const current = Array.isArray(values[filter.key])
                                ? values[filter.key]
                                : []
                              const next = e.target.checked
                                ? [...current, opt.value]
                                : current.filter((v: string) => v !== opt.value)
                              onChange(filter.key, next)
                            }}
                            className="rounded border-ds-border-primary text-ds-text-accent focus:ring-ds-border-accent"
                          />
                          {opt.label}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-ds-border-primary pt-3">
            <button
              onClick={onReset}
              className="rounded-lg border border-ds-border-primary px-4 py-1.5 text-sm font-medium text-ds-text-secondary hover:bg-ds-bg-secondary transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
