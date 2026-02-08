import type React from "react"
import type { BaseComponentProps, WithChildren } from "../components/ComponentTypes"

export interface NavItem {
  label: string
  href?: string
  icon?: React.ReactNode
  active?: boolean
  disabled?: boolean
  badge?: string | number
  children?: NavItem[]
  onClick?: () => void
}

export interface NavbarProps extends BaseComponentProps, WithChildren {
  brand?: React.ReactNode
  items?: NavItem[]
  actions?: React.ReactNode
  sticky?: boolean
  transparent?: boolean
  variant?: "default" | "minimal" | "bordered"
}

export interface SidebarProps extends BaseComponentProps, WithChildren {
  items?: NavItem[]
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  width?: string
  collapsedWidth?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  variant?: "default" | "minimal" | "bordered"
}

export interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  badge?: string | number
  content?: React.ReactNode
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[]
  activeKey?: string
  defaultActiveKey?: string
  onChange?: (key: string) => void
  variant?: "line" | "enclosed" | "pill"
  size?: "sm" | "md" | "lg"
  orientation?: "horizontal" | "vertical"
  fullWidth?: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  current?: boolean
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
  collapseAt?: number
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showFirstLast?: boolean
  showPageSize?: boolean
  showTotal?: boolean
  siblingCount?: number
  compact?: boolean
}

export interface StepperItem {
  key: string
  label: string
  description?: string
  icon?: React.ReactNode
  status?: "pending" | "active" | "completed" | "error"
}

export interface StepperProps extends BaseComponentProps {
  steps: StepperItem[]
  activeStep?: number
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "simple" | "circles"
  onChange?: (step: number) => void
  clickable?: boolean
}

export interface MenuItemProps {
  label: string
  value?: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  destructive?: boolean
  children?: MenuItemProps[]
  onClick?: () => void
}

export interface DropdownMenuProps extends BaseComponentProps {
  trigger: React.ReactNode
  items: MenuItemProps[]
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
}
