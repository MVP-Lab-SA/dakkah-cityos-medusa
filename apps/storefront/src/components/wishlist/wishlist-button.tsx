import React, { useState, useEffect, useCallback } from "react"

interface WishlistItem {
  productId: string
  variantId?: string
  addedAt: number
}

interface WishlistButtonProps {
  productId: string
  variantId?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

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

export function WishlistButton({
  productId,
  variantId,
  size = "md",
  showLabel = false,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [animating, setAnimating] = useState(false)

  const checkWishlist = useCallback(() => {
    const items = getWishlist()
    const found = items.some(
      (item) =>
        item.productId === productId &&
        (!variantId || item.variantId === variantId)
    )
    setIsInWishlist(found)
  }, [productId, variantId])

  useEffect(() => {
    checkWishlist()
    const handler = () => checkWishlist()
    window.addEventListener("wishlist-updated", handler)
    return () => window.removeEventListener("wishlist-updated", handler)
  }, [checkWishlist])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const items = getWishlist()
    let updated: WishlistItem[]

    if (isInWishlist) {
      updated = items.filter(
        (item) =>
          !(
            item.productId === productId &&
            (!variantId || item.variantId === variantId)
          )
      )
    } else {
      updated = [
        ...items,
        { productId, variantId, addedAt: Date.now() },
      ]
    }

    saveWishlist(updated)
    setIsInWishlist(!isInWishlist)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 400)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const labelSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  if (showLabel) {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border border-ds-border ${
          isInWishlist
            ? "bg-ds-destructive/10 text-ds-destructive border-ds-destructive/30"
            : "bg-ds-card text-ds-muted-foreground hover:text-ds-destructive hover:bg-ds-destructive/5"
        }`}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          className={`${iconSizes[size]} transition-transform ${
            animating ? "scale-125" : "scale-100"
          }`}
          fill={isInWishlist ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className={labelSizes[size]}>
          {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        isInWishlist
          ? "bg-ds-destructive/10 text-ds-destructive"
          : "bg-ds-card/80 text-ds-muted-foreground hover:text-ds-destructive hover:bg-ds-destructive/10"
      } backdrop-blur-sm border border-ds-border shadow-sm`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className={`${iconSizes[size]} transition-transform ${
          animating ? "scale-125" : "scale-100"
        }`}
        fill={isInWishlist ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
