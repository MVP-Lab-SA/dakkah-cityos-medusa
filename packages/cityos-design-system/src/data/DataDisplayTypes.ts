import type React from "react"
import type { BaseComponentProps, Size, ColorScheme, WithChildren } from "../components/ComponentTypes"

export interface TableColumn<T = unknown> {
  key: string
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  width?: string
  align?: "left" | "center" | "right"
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  sortable?: boolean
  selectable?: boolean
  selectedRows?: string[]
  onRowSelect?: (ids: string[]) => void
  onRowClick?: (row: T) => void
  onSort?: (column: string, direction: "asc" | "desc") => void
  stickyHeader?: boolean
  striped?: boolean
  bordered?: boolean
  compact?: boolean
}

export interface BadgeProps extends BaseComponentProps, WithChildren {
  variant?: "solid" | "outline" | "subtle"
  colorScheme?: ColorScheme
  size?: Size
  rounded?: boolean
  removable?: boolean
  onRemove?: () => void
}

export interface AvatarProps extends BaseComponentProps {
  src?: string
  alt?: string
  name?: string
  size?: Size
  shape?: "circle" | "square"
  fallback?: React.ReactNode
  status?: "online" | "offline" | "busy" | "away"
}

export interface AvatarGroupProps extends BaseComponentProps {
  max?: number
  size?: Size
  children?: React.ReactNode
}

export interface TagProps extends BaseComponentProps, WithChildren {
  variant?: "solid" | "outline" | "subtle"
  colorScheme?: ColorScheme
  size?: Size
  removable?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
}

export interface ProgressProps extends BaseComponentProps {
  value: number
  max?: number
  size?: Size
  colorScheme?: ColorScheme
  showValue?: boolean
  label?: string
  animated?: boolean
  striped?: boolean
}

export interface StatProps extends BaseComponentProps {
  label: string
  value: string | number
  helpText?: string
  change?: { value: number; type: "increase" | "decrease" }
  icon?: React.ReactNode
}

export interface EmptyStateProps extends BaseComponentProps, WithChildren {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export interface SkeletonProps extends BaseComponentProps {
  variant?: "text" | "circular" | "rectangular"
  width?: string
  height?: string
  lines?: number
  animated?: boolean
}

export interface TooltipProps extends BaseComponentProps, WithChildren {
  content: string
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}
