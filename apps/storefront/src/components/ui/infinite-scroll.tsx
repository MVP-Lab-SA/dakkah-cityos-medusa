"use client"

import { useEffect, useRef } from "react"

export interface InfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  loading?: boolean
  children: React.ReactNode
  threshold?: number
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading = false,
  children,
  threshold = 0.1,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          onLoadMore()
        }
      },
      { threshold }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore, threshold])

  return (
    <div>
      {children}

      {hasMore && (
        <div ref={sentinelRef} className="w-full py-4 flex items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-ds-muted-foreground">
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
