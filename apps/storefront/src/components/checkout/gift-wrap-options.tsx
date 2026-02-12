import React, { useState } from "react"

interface GiftWrapItem {
  id: string
  title: string
  thumbnail?: string
}

interface GiftWrapState {
  enabled: boolean
  message: string
}

interface GiftWrapOptionsProps {
  items: GiftWrapItem[]
  pricePerItem?: number
  currency?: string
  onChange?: (selections: Record<string, GiftWrapState>) => void
}

export function GiftWrapOptions({
  items,
  pricePerItem = 399,
  currency = "USD",
  onChange,
}: GiftWrapOptionsProps) {
  const [selections, setSelections] = useState<Record<string, GiftWrapState>>({})

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount / 100)
  }

  const toggleWrap = (itemId: string) => {
    const updated = {
      ...selections,
      [itemId]: {
        enabled: !selections[itemId]?.enabled,
        message: selections[itemId]?.message || "",
      },
    }
    setSelections(updated)
    onChange?.(updated)
  }

  const updateMessage = (itemId: string, message: string) => {
    if (message.length > 200) return
    const updated = {
      ...selections,
      [itemId]: { ...selections[itemId], enabled: true, message },
    }
    setSelections(updated)
    onChange?.(updated)
  }

  const wrappedCount = Object.values(selections).filter((s) => s.enabled).length
  const totalCost = wrappedCount * pricePerItem

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <h3 className="text-sm font-semibold text-ds-foreground">Gift Wrapping</h3>
        </div>
        {wrappedCount > 0 && (
          <span className="text-sm font-medium text-ds-primary">
            +{formatPrice(totalCost)}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const state = selections[item.id]
          const isEnabled = state?.enabled || false

          return (
            <div key={item.id} className="border border-ds-border rounded-lg overflow-hidden">
              <div className="p-3 flex items-center gap-3">
                {isEnabled ? (
                  <div className="w-10 h-10 rounded-md bg-ds-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎁</span>
                  </div>
                ) : item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-10 h-10 rounded-md object-cover border border-ds-border flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-ds-muted flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ds-foreground truncate">{item.title}</p>
                  <p className="text-xs text-ds-muted-foreground">{formatPrice(pricePerItem)} per item</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                  <span className="text-xs text-ds-muted-foreground">Add gift wrap</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={() => toggleWrap(item.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isEnabled ? "bg-ds-primary" : "bg-ds-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isEnabled ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>

              {isEnabled && (
                <div className="px-3 pb-3 pt-0">
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-ds-muted-foreground mb-1">
                      Gift message (optional)
                    </label>
                    <textarea
                      value={state?.message || ""}
                      onChange={(e) => updateMessage(item.id, e.target.value)}
                      rows={2}
                      maxLength={200}
                      placeholder="Write a personal message..."
                      className="w-full px-3 py-2 text-sm bg-ds-muted border border-ds-border rounded-md text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-1 focus:ring-ds-primary resize-none"
                    />
                    <p className="text-xs text-ds-muted-foreground text-end mt-0.5">
                      {(state?.message || "").length}/200
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {wrappedCount > 0 && (
        <div className="bg-ds-muted rounded-md p-3 flex items-center justify-between">
          <span className="text-sm text-ds-muted-foreground">
            {wrappedCount} item{wrappedCount !== 1 ? "s" : ""} with gift wrapping
          </span>
          <span className="text-sm font-semibold text-ds-foreground">
            Total: {formatPrice(totalCost)}
          </span>
        </div>
      )}
    </div>
  )
}
