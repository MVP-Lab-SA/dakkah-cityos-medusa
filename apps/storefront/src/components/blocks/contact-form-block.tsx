import React, { useState } from 'react'

interface FormField {
  name: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  options?: string[]
  width?: 'full' | 'half'
}

interface ContactFormBlockProps {
  heading?: string
  description?: string
  fields: FormField[]
  submitText?: string
  successMessage?: string
  recipientEmail?: string
}

export const ContactFormBlock: React.FC<ContactFormBlockProps> = ({
  heading,
  description,
  fields,
  submitText = 'Submit',
  successMessage = 'Thank you! Your message has been sent.',
  recipientEmail,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!fields || fields.length === 0) return null

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="bg-ds-card border border-ds-border rounded-xl p-8 md:p-12 text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-4 text-ds-primary">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
              <path d="M14 24l7 7 13-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-lg font-semibold text-ds-foreground">{successMessage}</p>
          </div>
        </div>
      </section>
    )
  }

  const renderField = (field: FormField) => {
    const baseInputClasses =
      'w-full px-4 py-3 bg-ds-background border border-ds-border rounded-lg text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary focus:border-transparent transition-colors'

    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          rows={4}
          className={baseInputClasses}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      )
    }

    if (field.type === 'select' && field.options) {
      return (
        <select
          name={field.name}
          required={field.required}
          className={baseInputClasses}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          <option value="">{field.placeholder || `Select ${field.label}`}</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={field.type}
        name={field.name}
        required={field.required}
        placeholder={field.placeholder}
        className={baseInputClasses}
        value={formData[field.name] || ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-4 text-center">
            {heading}
          </h2>
        )}
        {description && (
          <p className="text-ds-muted-foreground mb-8 text-center">{description}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-ds-card border border-ds-border rounded-xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.width === 'half' ? '' : 'md:col-span-2'}
              >
                <label className="block text-sm font-medium text-ds-foreground mb-2">
                  {field.label}
                  {field.required && (
                    <span className="text-ds-destructive ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-8 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Sending...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
