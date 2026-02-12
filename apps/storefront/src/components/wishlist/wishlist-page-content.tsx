import React, { useState, useEffect, useMemo } from "react"

interface WishlistItem {
  productId: string
  variantId?: string
  addedAt: number
  title?: string
  price?: number
  variant?: string
  thumbnail?: string
}

type SortOption = "date_added" | "price_low_high" | "price_high_low"

const WISHLIST_KEY = "dakkah_wishlist"

function getWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveWishlist(items: WishlistItem[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: items }))
}

export function WishlistPageContent() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("date_added")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [shareMessage, setShareMessage] = useState("")

  useEffect(() => {
    setItems(getWishlist())
    const handler = () => setItems(getWishlist())
    window.addEventListener("wishlist-updated", handler)
    return () => window.removeEventListener("wishlist-updated", handler)
  }, [])

  const sortedItems = useMemo(() => {
    const sorted = [...items]
    switch (sortBy) {
      case "price_low_high":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case "price_high_low":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      case "date_added":
      default:
        return sorted.sort((a, b) => b.addedAt - a.addedAt)
    }
  }, [items, sortBy])

  const handleRemove = (productId: string, variantId?: string) => {
    const updated = items.filter(
      (item) =>
        !(
          item.productId === productId &&
          (!variantId || item.variantId === variantId)
        )
    )
    saveWishlist(updated)
    setItems(updated)
  }

  const handleMoveToCart = (item: WishlistItem) => {
    console.log("Move to cart:", item.productId)
    handleRemove(item.productId, item.variantId)
  }

  const handleClearAll = () => {
    saveWishlist([])
    setItems([])
    setShowClearConfirm(false)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setShareMessage("Link copied to clipboard!")
      setTimeout(() => setShareMessage(""), 3000)
    }).catch(() => {
      setShareMessage("Failed to copy link")
      setTimeout(() => setShareMessage(""), 3000)
    })
  }

  if (items.length === 0) {
    return (
      <div className="bg-ds-card rounded-lg border border-ds-border p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ds-muted flex items-center justify-center">
          <svg
            className="w-8 h-8 text-ds-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-sm text-ds-muted-foreground mb-6">
          Start adding items you love by clicking the heart icon on products
        </p>
        <button
          type="button"
          className="px-6 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 text-sm rounded-lg border border-ds-border bg-ds-card text-ds-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
          >
            <option value="date_added">Date Added</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
          </select>
          <span className="text-sm text-ds-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-ds-border bg-ds-card text-ds-foreground hover:bg-ds-muted transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Wishlist
          </button>

          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-ds-border bg-ds-card text-ds-destructive hover:bg-ds-destructive/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ds-destructive">Are you sure?</span>
              <button
                onClick={handleClearAll}
                className="px-3 py-2 text-sm font-medium rounded-lg bg-ds-destructive text-white hover:opacity-90 transition-opacity"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-ds-border bg-ds-card text-ds-foreground hover:bg-ds-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {shareMessage && (
            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-ds-foreground text-ds-background text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
              {shareMessage}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedItems.map((item) => (
          <div
            key={`${item.productId}-${item.variantId || ""}`}
            className="bg-ds-card border border-ds-border rounded-lg overflow-hidden group"
          >
            <div className="relative">
              <div className="bg-ds-muted aspect-square flex items-center justify-center">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title || "Product"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-ds-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <button
                onClick={() => handleRemove(item.productId, item.variantId)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-ds-background/80 text-ds-destructive hover:bg-ds-background flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-ds-foreground mb-1 truncate">
                {item.title || `Product ${item.productId.slice(0, 8)}`}
              </h3>
              {item.variant && (
                <p className="text-xs text-ds-muted-foreground mb-2">{item.variant}</p>
              )}
              <div className="flex items-center gap-2 mb-3">
                {item.price != null ? (
                  <span className="font-semibold text-ds-foreground">
                    ${item.price.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-sm text-ds-muted-foreground">Price unavailable</span>
                )}
              </div>
              <button
                onClick={() => handleMoveToCart(item)}
                className="w-full py-2 rounded-md bg-ds-primary text-ds-primary-foreground text-sm font-medium hover:bg-ds-primary/90 transition-colors"
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
