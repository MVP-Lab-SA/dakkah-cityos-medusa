import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface OrderRow {
  id: string
  sku: string
  quantity: number
}

interface BulkOrderFormProps {
  locale?: string
  onSubmit?: (rows: OrderRow[]) => void
}

let nextId = 1

export function BulkOrderForm({ locale: localeProp, onSubmit }: BulkOrderFormProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [rows, setRows] = useState<OrderRow[]>([
    { id: String(nextId++), sku: "", quantity: 1 },
  ])

  const addRow = () => {
    setRows([...rows, { id: String(nextId++), sku: "", quantity: 1 }])
  }

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id))
    }
  }

  const updateRow = (id: string, field: "sku" | "quantity", value: string | number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const clearForm = () => {
    nextId = 1
    setRows([{ id: String(nextId++), sku: "", quantity: 1 }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validRows = rows.filter((r) => r.sku.trim() && r.quantity > 0)
    if (validRows.length > 0) {
      onSubmit?.(validRows)
    }
  }

  return (
    <div className="bg-ds-card rounded-lg border border-ds-border">
      <div className="p-4 border-b border-ds-border">
        <h3 className="font-semibold text-ds-foreground">
          {t(locale, "wholesale.quick_order")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="grid grid-cols-[1fr_100px_40px] sm:grid-cols-[1fr_120px_40px] gap-2 items-center">
          <span className="text-xs font-medium text-ds-muted-foreground uppercase tracking-wider">
            {t(locale, "wholesale.sku")}
          </span>
          <span className="text-xs font-medium text-ds-muted-foreground uppercase tracking-wider">
            {t(locale, "wholesale.quantity")}
          </span>
          <span />
        </div>

        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_100px_40px] sm:grid-cols-[1fr_120px_40px] gap-2 items-center">
            <input
              type="text"
              value={row.sku}
              onChange={(e) => updateRow(row.id, "sku", e.target.value)}
              placeholder={t(locale, "wholesale.enter_sku")}
              className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
            />
            <input
              type="number"
              min={1}
              value={row.quantity}
              onChange={(e) => updateRow(row.id, "quantity", parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary/50"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="p-2 text-ds-muted-foreground hover:text-ds-destructive transition-colors disabled:opacity-30"
              disabled={rows.length === 1}
              aria-label={t(locale, "wholesale.remove_row")}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-ds-border rounded-lg text-sm text-ds-muted-foreground hover:text-ds-foreground hover:border-ds-foreground/50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t(locale, "wholesale.add_row")}
        </button>

        <div className="flex items-center justify-between pt-2 border-t border-ds-border">
          <button
            type="button"
            onClick={clearForm}
            className="px-4 py-2 text-sm text-ds-muted-foreground hover:text-ds-foreground transition-colors"
          >
            {t(locale, "wholesale.clear_form")}
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t(locale, "wholesale.submit_order")}
          </button>
        </div>
      </form>
    </div>
  )
}
