import type React from "react"
import type {
  BaseComponentProps,
  InteractiveComponentProps,
  Size,
  Variant,
  WithIcon,
  WithLabel,
  WithValidation,
} from "../components/ComponentTypes"

export interface ButtonProps extends InteractiveComponentProps, WithIcon {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  type?: "button" | "submit" | "reset"
  children?: React.ReactNode
}

export interface InputProps extends BaseComponentProps, WithLabel, WithValidation {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search"
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  autoComplete?: string
  maxLength?: number
  size?: Size
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
  group?: string
}

export interface SelectProps extends BaseComponentProps, WithLabel, WithValidation {
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  options: SelectOption[]
  disabled?: boolean
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  size?: Size
  onChange?: (value: string | string[]) => void
}

export interface CheckboxProps extends BaseComponentProps, WithLabel {
  name?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean
  error?: string
  onChange?: (checked: boolean) => void
}

export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
  description?: string
}

export interface RadioGroupProps extends BaseComponentProps, WithLabel, WithValidation {
  name?: string
  value?: string
  defaultValue?: string
  options: RadioOption[]
  disabled?: boolean
  orientation?: "horizontal" | "vertical"
  onChange?: (value: string) => void
}

export interface TextareaProps extends BaseComponentProps, WithLabel, WithValidation {
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  rows?: number
  maxLength?: number
  resize?: "none" | "vertical" | "horizontal" | "both"
  onChange?: (value: string) => void
}

export interface SwitchProps extends BaseComponentProps, WithLabel {
  name?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  size?: Size
  onChange?: (checked: boolean) => void
}

export interface FormFieldProps extends BaseComponentProps {
  label?: string
  htmlFor?: string
  error?: string
  helperText?: string
  required?: boolean
  children?: React.ReactNode
}
