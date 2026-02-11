import { clsx } from "clsx"
import { Drawer } from "./drawer"
import { Input } from "./input"
import { Select } from "./select"
import { Textarea } from "./textarea"
import { Label } from "./label"
import { Button } from "./button"

export type FieldType = "text" | "number" | "email" | "textarea" | "select" | "date" | "url" | "checkbox"

export interface FormField {
  key: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  disabled?: boolean
  helpText?: string
  colSpan?: 1 | 2
}

interface FormDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  fields: FormField[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onSubmit: () => void
  loading?: boolean
  submitLabel?: string
}

export function FormDrawer({
  open,
  onClose,
  title,
  description,
  fields,
  values,
  onChange,
  onSubmit,
  loading = false,
  submitLabel = "Save changes",
}: FormDrawerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const renderField = (field: FormField) => {
    const value = values[field.key] ?? ""

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.key}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled || loading}
          />
        )

      case "select":
        return (
          <Select
            id={field.key}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            options={field.options || []}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled || loading}
          />
        )

      case "checkbox":
        return (
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id={field.key}
              checked={!!value}
              onChange={(e) => onChange(field.key, e.target.checked)}
              disabled={field.disabled || loading}
              className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-700">{field.placeholder || ""}</span>
          </label>
        )

      default:
        return (
          <Input
            id={field.key}
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled || loading}
          />
        )
    }
  }

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSubmit} isLoading={loading}>
        {submitLabel}
      </Button>
    </>
  )

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div
            key={field.key}
            className={clsx(
              field.colSpan === 2 || field.type === "textarea" ? "col-span-2" : "col-span-2 sm:col-span-1"
            )}
          >
            {field.type !== "checkbox" && (
              <Label htmlFor={field.key} required={field.required} className="mb-1.5 block">
                {field.label}
              </Label>
            )}
            {field.type === "checkbox" && (
              <Label className="mb-1.5 block">{field.label}</Label>
            )}
            {renderField(field)}
            {field.helpText && (
              <p className="mt-1 text-xs text-gray-400">{field.helpText}</p>
            )}
          </div>
        ))}
      </form>
    </Drawer>
  )
}
