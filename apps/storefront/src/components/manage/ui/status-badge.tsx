import { clsx } from "clsx"

const dotColorMap: Record<string, string> = {
  active: "bg-emerald-500",
  completed: "bg-emerald-500",
  delivered: "bg-emerald-500",
  paid: "bg-emerald-500",
  approved: "bg-emerald-500",
  confirmed: "bg-emerald-500",
  draft: "bg-gray-400",
  inactive: "bg-gray-400",
  archived: "bg-gray-400",
  deactivated: "bg-gray-400",
  pending: "bg-amber-500",
  processing: "bg-amber-500",
  in_progress: "bg-amber-500",
  review: "bg-amber-500",
  cancelled: "bg-red-500",
  failed: "bg-red-500",
  rejected: "bg-red-500",
  suspended: "bg-red-500",
  expired: "bg-red-500",
  invited: "bg-violet-500",
  shipped: "bg-violet-500",
  scheduled: "bg-blue-500",
}

interface StatusBadgeProps {
  status: string
  label?: string
  variants?: Record<string, string>
  className?: string
}

export function StatusBadge({ status, label, variants, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/[\s-]/g, "_")
  const dotColor = variants?.[status] || dotColorMap[normalizedStatus] || "bg-gray-400"
  const displayLabel = label || status.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <span
      className={clsx(
        "inline-flex gap-1.5 items-center whitespace-nowrap",
        className
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColor)} />
      <span className="text-xs font-normal text-gray-700">
        {displayLabel}
      </span>
    </span>
  )
}
