import React from "react"

const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
}

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: keyof typeof sizes
  className?: string
  status?: "online" | "offline" | "busy" | "away"
}

const statusColors = {
  online: "bg-ds-success",
  offline: "bg-ds-muted-foreground",
  busy: "bg-ds-destructive",
  away: "bg-ds-warning",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  className = "",
  status,
}) => {
  const [imgError, setImgError] = React.useState(false)

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-ds-muted text-ds-muted-foreground font-medium`}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 end-0 block w-2.5 h-2.5 rounded-full ring-2 ring-ds-background ${statusColors[status]}`}
        />
      )}
    </div>
  )
}
