import type React from "react"
import type { BaseComponentProps, WithChildren } from "../components/ComponentTypes"

export interface ModalProps extends BaseComponentProps, WithChildren {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export interface AlertProps extends BaseComponentProps, WithChildren {
  variant?: "info" | "success" | "warning" | "error"
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
}

export interface ToastNotification {
  id: string
  title?: string
  message: string
  variant?: "info" | "success" | "warning" | "error"
  duration?: number
  action?: { label: string; onClick: () => void }
  dismissible?: boolean
}

export interface ToastProviderProps extends WithChildren {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
  maxToasts?: number
}

export interface NotificationProps extends BaseComponentProps {
  title: string
  message: string
  timestamp?: string
  read?: boolean
  avatar?: string
  action?: { label: string; onClick: () => void }
  onDismiss?: () => void
}

export interface ConfirmDialogProps extends BaseComponentProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export interface BannerProps extends BaseComponentProps, WithChildren {
  variant?: "info" | "success" | "warning" | "error" | "promo"
  dismissible?: boolean
  onDismiss?: () => void
  sticky?: boolean
  icon?: React.ReactNode
  action?: React.ReactNode
}
