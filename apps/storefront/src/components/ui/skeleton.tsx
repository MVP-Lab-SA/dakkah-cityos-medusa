import React from "react"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string
  height?: string
  lines?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1,
}) => {
  const baseClass = "animate-pulse bg-ds-muted"

  if (variant === "circular") {
    return (
      <div
        className={`${baseClass} rounded-full ${className}`}
        style={{ width: width || "2.5rem", height: height || width || "2.5rem" }}
      />
    )
  }

  if (variant === "text" || lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} style={{ width }}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`${baseClass} rounded h-4 ${i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"}`}
            style={{ height: height || undefined }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClass} rounded ${className}`}
      style={{ width, height: height || "1rem" }}
    />
  )
}
