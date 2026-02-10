import { ExclamationCircle } from "@medusajs/icons"

interface FormErrorProps {
  error?: string | null
  className?: string
}

export function FormError({ error, className = "" }: FormErrorProps) {
  if (!error) return null
  
  return (
    <div className={`flex items-center gap-2 text-ds-destructive text-sm mt-1 ${className}`}>
      <ExclamationCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )
}

interface FormFieldProps {
  label: string
  error?: string | null
  required?: boolean
  children: React.ReactNode
  className?: string
  htmlFor?: string
}

export function FormField({ label, error, required, children, className = "", htmlFor }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ds-foreground mb-1">
        {label}
        {required && <span className="text-ds-destructive ml-1">*</span>}
      </label>
      {children}
      <FormError error={error} />
    </div>
  )
}
