import { clsx } from "clsx"

const dotColorMap: Record<string, string> = {
  active: "bg-emerald-500",
  completed: "bg-emerald-500",
  delivered: "bg-emerald-500",
  draft: "bg-amber-500",
  pending: "bg-amber-500",
  processing: "bg-amber-500",
  cancelled: "bg-red-500",
  suspended: "bg-red-500",
  archived: "bg-gray-400",
  deactivated: "bg-gray-400",
  invited: "bg-violet-500",
  shipped: "bg-violet-500",
}

interface StatusBadgeProps {
  status: string
  label?: string
  variants?: Record<string, string>
  className?: string
}

export function StatusBadge({ status, label, variants, className }: StatusBadgeProps) {
  const dotColor = variants?.[status] || dotColorMap[status] || "bg-gray-400"

  return (
    <span
      className={clsx(
        "inline-flex gap-1.5 items-center whitespace-nowrap",
        className
      )}
    >
      <span className={clsx("w-1 h-1 rounded-full", dotColor)} />
      <span className="text-xs font-normal text-gray-700">
        {label || status}
      </span>
    </span>
  )
}
