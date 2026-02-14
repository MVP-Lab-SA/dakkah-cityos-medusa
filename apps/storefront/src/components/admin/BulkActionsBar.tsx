// @ts-nocheck
import { useState } from "react"

interface CustomAction {
  label: string
  onClick: () => void
  variant?: string
}

interface BulkActionsBarProps {
  selectedCount: number
  onApprove?: () => void
  onReject?: () => void
  onDelete?: () => void
  onExport?: () => void
  onClearSelection: () => void
  customActions?: CustomAction[]
}

export function BulkActionsBar({
  selectedCount,
  onApprove,
  onReject,
  onDelete,
  onExport,
  onClearSelection,
  customActions = [],
}: BulkActionsBarProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (selectedCount === 0) return null

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete?.()
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-ds-border-primary bg-ds-bg-primary shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-ds-bg-accent px-3 py-1 text-sm font-medium text-ds-text-accent">
              {selectedCount} selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-sm text-ds-text-secondary hover:text-ds-text-primary transition-colors"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onApprove && (
              <button
                onClick={onApprove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
            )}

            {onReject && (
              <button
                onClick={onReject}
                className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Reject
              </button>
            )}

            {onDelete && (
              <button
                onClick={handleDelete}
                onBlur={() => setConfirmDelete(false)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors ${
                  confirmDelete
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {confirmDelete ? "Confirm Delete" : "Delete"}
              </button>
            )}

            {onExport && (
              <button
                onClick={onExport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ds-border-primary bg-ds-bg-primary px-3 py-1.5 text-sm font-medium text-ds-text-primary hover:bg-ds-bg-secondary transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            )}

            {customActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  action.variant === "danger"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : action.variant === "success"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border border-ds-border-primary bg-ds-bg-primary text-ds-text-primary hover:bg-ds-bg-secondary"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
