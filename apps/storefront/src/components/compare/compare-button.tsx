import React, { useState, useEffect, useCallback } from "react"

interface CompareItem {
  productId: string
  productTitle: string
  addedAt: number
}

interface CompareButtonProps {
  productId: string
  productTitle: string
  maxCompare?: number
}

const COMPARE_KEY = "dakkah_compare"

function getCompareList(): CompareItem[] {
  try {
    const raw = localStorage.getItem(COMPARE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCompareList(items: CompareItem[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent("compare-updated", { detail: items }))
}

export function CompareButton({
  productId,
  productTitle,
  maxCompare = 4,
}: CompareButtonProps) {
  const [isInCompare, setIsInCompare] = useState(false)
  const [compareCount, setCompareCount] = useState(0)
  const [toastMessage, setToastMessage] = useState("")

  const checkCompare = useCallback(() => {
    const items = getCompareList()
    setIsInCompare(items.some((item) => item.productId === productId))
    setCompareCount(items.length)
  }, [productId])

  useEffect(() => {
    checkCompare()
    const handler = () => checkCompare()
    window.addEventListener("compare-updated", handler)
    return () => window.removeEventListener("compare-updated", handler)
  }, [checkCompare])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const items = getCompareList()

    if (isInCompare) {
      const updated = items.filter((item) => item.productId !== productId)
      saveCompareList(updated)
    } else {
      if (items.length >= maxCompare) {
        setToastMessage(`Maximum ${maxCompare} products can be compared`)
        setTimeout(() => setToastMessage(""), 3000)
        return
      }
      const updated = [
        ...items,
        { productId, productTitle, addedAt: Date.now() },
      ]
      saveCompareList(updated)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
          isInCompare
            ? "bg-ds-primary/10 text-ds-primary border-ds-primary/30"
            : "bg-ds-card text-ds-muted-foreground border-ds-border hover:text-ds-foreground hover:bg-ds-muted"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        {isInCompare ? "In Compare" : "Compare"}
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-ds-muted text-ds-muted-foreground">
          {compareCount}/{maxCompare}
        </span>
      </button>

      {toastMessage && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-ds-foreground text-ds-background text-sm rounded-lg shadow-lg whitespace-nowrap z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
