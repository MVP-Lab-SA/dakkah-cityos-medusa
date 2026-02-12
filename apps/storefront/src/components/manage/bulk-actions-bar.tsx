import React, { useState, useEffect, useRef } from 'react'

interface BulkActionsBarProps {
  selectedCount: number
  onBulkDelete: () => void
  onBulkStatusChange: (status: string) => void
  onBulkExport: () => void
  onClearSelection: () => void
  availableStatuses: string[]
}

export function BulkActionsBar({
  selectedCount,
  onBulkDelete,
  onBulkStatusChange,
  onBulkExport,
  onClearSelection,
  availableStatuses,
}: BulkActionsBarProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (showDeleteConfirm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showDeleteConfirm])

  if (selectedCount === 0) return null

  return (
    <>
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-ds-card border border-ds-border rounded-xl shadow-xl px-5 py-3 flex items-center gap-4 animate-[slideUp_0.2s_ease-out]"
        style={{ minWidth: 420 }}
      >
        <span className="text-sm font-medium text-ds-foreground whitespace-nowrap">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>

        <div className="w-px h-6 bg-ds-border" />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-ds-muted text-ds-foreground rounded-md hover:bg-ds-muted/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Status
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showStatusDropdown && (
            <div className="absolute bottom-full mb-2 left-0 bg-ds-card border border-ds-border rounded-lg shadow-lg py-1 min-w-[160px] z-50">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    onBulkStatusChange(status)
                    setShowStatusDropdown(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-ds-foreground hover:bg-ds-muted transition-colors capitalize"
                >
                  {status.replace(/[_-]/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onBulkExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-ds-muted text-ds-foreground rounded-md hover:bg-ds-muted/80 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-ds-destructive text-ds-primary-foreground rounded-md hover:opacity-90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>

        <div className="w-px h-6 bg-ds-border" />

        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 text-ds-muted-foreground hover:text-ds-foreground rounded-md hover:bg-ds-muted transition-colors"
          title="Clear selection"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-ds-card border border-ds-border rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-base font-semibold text-ds-foreground">Confirm Deletion</h2>
            <p className="mt-2 text-sm text-ds-muted-foreground">
              Are you sure you want to delete {selectedCount} item{selectedCount !== 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-sm font-medium border border-ds-border rounded-md text-ds-foreground hover:bg-ds-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onBulkDelete()
                  setShowDeleteConfirm(false)
                }}
                className="px-3 py-2 text-sm font-medium bg-ds-destructive text-ds-primary-foreground rounded-md hover:opacity-90 transition-colors"
              >
                Delete {selectedCount} item{selectedCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
