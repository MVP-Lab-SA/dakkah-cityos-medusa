import { clsx } from "clsx"

const dotColorMap: Record<string, string> = {
  active: "bg-ds-success",
  completed: "bg-ds-success",
  delivered: "bg-ds-success",
  draft: "bg-ds-warning",
  pending: "bg-ds-warning",
  processing: "bg-ds-warning",
  cancelled: "bg-ds-destructive",
  suspended: "bg-ds-destructive",
  archived: "bg-ds-muted",
  deactivated: "bg-ds-muted",
  invited: "bg-ds-primary",
  shipped: "bg-ds-primary",
}

interface StatusBadgeProps {
  status: string
  label?: string
  variants?: Record<string, string>
  className?: string
}

export function StatusBadge({ status, label, variants, className }: StatusBadgeProps) {
  const dotColor = variants?.[status] || dotColorMap[status] || "bg-ds-muted"

  return (
    <span
      className={clsx(
        "inline-flex gap-1.5 items-center whitespace-nowrap",
        className
      )}
    >
      <span className={clsx("w-1 h-1 rounded-full", dotColor)} />
      <span className="text-xs font-normal text-ds-text">
        {label || status}
      </span>
    </span>
  )
}
