import { clsx } from "clsx"

const defaultVariants: Record<string, string> = {
  active: "bg-ds-success/10 text-ds-success",
  draft: "bg-ds-warning/10 text-ds-warning",
  archived: "bg-ds-muted text-ds-muted-foreground",
  pending: "bg-ds-warning/10 text-ds-warning",
  processing: "bg-ds-primary/10 text-ds-primary",
  shipped: "bg-ds-primary/10 text-ds-primary",
  delivered: "bg-ds-success/10 text-ds-success",
  cancelled: "bg-ds-destructive/10 text-ds-destructive",
  invited: "bg-ds-primary/10 text-ds-primary",
  suspended: "bg-ds-destructive/10 text-ds-destructive",
  deactivated: "bg-ds-muted text-ds-muted-foreground",
}

interface StatusBadgeProps {
  status: string
  label?: string
  variants?: Record<string, string>
  className?: string
}

export function StatusBadge({ status, label, variants, className }: StatusBadgeProps) {
  const variantMap = variants || defaultVariants
  const style = variantMap[status] || "bg-ds-muted text-ds-muted-foreground"

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap",
        style,
        className
      )}
    >
      {label || status}
    </span>
  )
}
