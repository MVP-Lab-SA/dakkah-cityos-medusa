import React, { useState, useMemo } from 'react'
import { crudConfigs } from './crud-configs'
import { AnalyticsOverview } from './analytics-overview'
import { AdvancedFilters, type FilterField } from './advanced-filters'
import { BulkActionsBar } from './bulk-actions-bar'

interface ManagePageWrapperProps {
  moduleKey: string
  title?: string
  children?: React.ReactNode
  tenantId: string
  locale: string
}

export function ManagePageWrapper({
  moduleKey,
  title,
  children,
  tenantId,
  locale,
}: ManagePageWrapperProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list')
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  const config = crudConfigs[moduleKey]
  const displayTitle = title || config?.label || moduleKey

  const filterFields: FilterField[] = useMemo(() => {
    if (!config) return []
    return config.fields
      .filter((f) => ['text', 'select', 'date', 'number'].includes(f.type))
      .slice(0, 6)
      .map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type === 'email' || f.type === 'url' || f.type === 'textarea'
          ? 'text' as const
          : f.type === 'checkbox'
            ? 'boolean' as const
            : f.type as FilterField['type'],
        options: f.options,
      }))
  }, [config])

  const availableStatuses = useMemo(() => {
    if (!config) return []
    const statusField = config.fields.find((f) => f.key === 'status')
    return statusField?.options?.map((o) => o.value) || []
  }, [config])

  const handleApplyFilters = (filters: Record<string, any>) => {
    setActiveFilterCount(Object.keys(filters).length)
  }

  const handleClearFilters = () => {
    setActiveFilterCount(0)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <nav className="flex items-center gap-1.5 text-xs text-ds-muted-foreground">
          <span>Manage</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-ds-foreground font-medium">{displayTitle}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl font-semibold text-ds-foreground">{displayTitle}</h1>
          <div className="flex items-center gap-2">
            {config?.canCreate !== false && (
              <button
                type="button"
                onClick={() => setShowCreateDrawer(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-md hover:opacity-90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create {config?.singularLabel || 'Item'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-ds-border">
        <nav className="flex gap-0 -mb-px" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'list'}
            onClick={() => setActiveTab('list')}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'list'
                ? 'border-ds-primary text-ds-primary'
                : 'border-transparent text-ds-muted-foreground hover:text-ds-foreground hover:border-ds-border'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            List View
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-ds-primary text-ds-primary'
                : 'border-transparent text-ds-muted-foreground hover:text-ds-foreground hover:border-ds-border'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
        </nav>
      </div>

      {activeTab === 'analytics' ? (
        <AnalyticsOverview tenantId={tenantId} locale={locale} moduleKey={moduleKey} />
      ) : (
        <div className="space-y-4">
          {filterFields.length > 0 && (
            <AdvancedFilters
              fields={filterFields}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              activeFilterCount={activeFilterCount}
            />
          )}

          {children}

          {selectedCount > 0 && (
            <BulkActionsBar
              selectedCount={selectedCount}
              onBulkDelete={() => setSelectedCount(0)}
              onBulkStatusChange={() => {}}
              onBulkExport={() => {}}
              onClearSelection={() => setSelectedCount(0)}
              availableStatuses={availableStatuses}
            />
          )}
        </div>
      )}
    </div>
  )
}
