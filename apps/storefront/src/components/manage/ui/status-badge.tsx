import { clsx } from "clsx"

const dotColorMap: Record<string, string> = {
  active: "bg-ds-success",
  completed: "bg-ds-success",
  delivered: "bg-ds-success",
  paid: "bg-ds-success",
  approved: "bg-ds-success",
  confirmed: "bg-ds-success",
  draft: "bg-ds-muted-foreground/70",
  inactive: "bg-ds-muted-foreground/70",
  archived: "bg-ds-muted-foreground/70",
  deactivated: "bg-ds-muted-foreground/70",
  pending: "bg-ds-warning",
  processing: "bg-ds-warning",
  in_progress: "bg-ds-warning",
  review: "bg-ds-warning",
  cancelled: "bg-ds-destructive",
  failed: "bg-ds-destructive",
  rejected: "bg-ds-destructive",
  suspended: "bg-ds-destructive",
  expired: "bg-ds-destructive",
  invited: "bg-ds-info",
  shipped: "bg-ds-info",
  scheduled: "bg-ds-info",
}

interface StatusBadgeProps {
  status: string
  label?: string
  variants?: Record<string, string>
  className?: string
}

export function StatusBadge({ status, label, variants, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/[\s-]/g, "_")
  const dotColor = variants?.[status] || dotColorMap[normalizedStatus] || "bg-ds-muted-foreground/70"
  const displayLabel = label || status.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <span
      className={clsx(
        "inline-flex gap-1.5 items-center whitespace-nowrap",
        className
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColor)} />
      <span className="text-xs font-normal text-ds-foreground/80">
        {displayLabel}
      </span>
    </span>
  )
}
