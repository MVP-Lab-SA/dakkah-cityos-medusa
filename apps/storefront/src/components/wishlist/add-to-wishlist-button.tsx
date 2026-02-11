import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"

interface AddToWishlistButtonProps {
  locale?: string
  productId: string
  isInWishlist?: boolean
  onToggle?: (productId: string, added: boolean) => void
  size?: "sm" | "md" | "lg"
}

export function AddToWishlistButton({
  locale: localeProp,
  productId,
  isInWishlist = false,
  onToggle,
  size = "md",
}: AddToWishlistButtonProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [active, setActive] = useState(isInWishlist)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setActive(isInWishlist)
  }, [isInWishlist])

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = !active
    setActive(newState)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)
    onToggle?.(productId, newState)
  }

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        active
          ? "bg-ds-destructive/10 text-ds-destructive"
          : "bg-ds-card/80 text-ds-muted-foreground hover:text-ds-destructive hover:bg-ds-destructive/10"
      } backdrop-blur-sm border border-ds-border shadow-sm`}
      title={active ? t(locale, "wishlist.remove_from_wishlist") : t(locale, "wishlist.add_to_wishlist")}
      aria-label={active ? t(locale, "wishlist.remove_from_wishlist") : t(locale, "wishlist.add_to_wishlist")}
    >
      <svg
        className={`${iconSizes[size]} transition-transform ${animating ? "scale-125" : "scale-100"}`}
        fill={active ? "currentColor" : "none"}
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
